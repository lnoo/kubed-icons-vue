import fs from 'fs-extra';
import path from 'path';
import SVGO from 'svgo';
import { transform } from '@babel/core';
import svgoConfig from './svgo.config';
import {
  toComponentName,
  toHumpName,
  makeBasicDefinition,
  moduleBabelConfig,
} from './utils';

const outputDir = path.join(__dirname, '../', 'dist');

const sourceDirs = [
  path.join(__dirname, '../', 'source'),
  path.join(__dirname, '../', 'fill'),
  path.join(__dirname, '../', 'duotone'),
];

const primaryColor = '#324558';

const parseSvg = (svg: string) => {
  return svg.replace(
    /<svg([^>]+)>/,
    `<svg$1 
      fill="#b6c2cd" 
      color="#324558"
      :width="size"
      :height="size"
      :class="classes"
      ref="svgRef"
      v-bind="attrs"
    >`
  );
};

export default (async () => {
  await fs.remove(outputDir);
  const svgo = new SVGO(svgoConfig);

  let exports = '';
  let definition = makeBasicDefinition();
  const iconSet: Record<string, string[]> = {};

  const action = async (sourceDir: string) => {
    const dirs = fs.readdirSync(sourceDir);

    for (const dir of dirs) {
      const dirStat = fs.lstatSync(`${sourceDir}/${dir}`);
      if (!dirStat.isDirectory()) continue;

      iconSet[dir] = [];

      const files = fs.readdirSync(`${sourceDir}/${dir}`);

      for (const file of files) {
        const componentName = toComponentName(file.split('.')[0]);
        const fileName = toHumpName(file.split('.')[0]);
        iconSet[dir].push(componentName);

        const fileContent = fs.readFileSync(`${sourceDir}/${dir}/${file}`);
        const { data } = await svgo.optimize(fileContent);
        const optimizedSvgString = data.replace(
          new RegExp(`${primaryColor}`, 'g'),
          'currentColor'
        );
        const component = `
<template>
  ${parseSvg(optimizedSvgString)}
</template>

<script setup lang="ts">
import { computed, useAttrs, ref } from 'vue';

const props = defineProps<{
  variant?: 'dark' | 'light';
  size?: number | string;
  className?: string;
}>();

const attrs = useAttrs();
const svgRef = ref<SVGSVGElement | null>(null);

const classes = computed(() => {
  return ['kubed-icon', \`kubed-icon__\${props.variant || 'dark'}\`, props.className];
});
</script>
        `.trim();
        const componentDefinition = `
import { DefineComponent } from 'vue';
import { Icon } from './types';

declare const ${componentName}: DefineComponent<{
  variant?: string;
  size?: number | string;
  className?: string;
}>;

export default ${componentName};
        `.trim();
        const jsCode = transform(`export { default } from './${fileName}.vue'`, moduleBabelConfig).code!;

        await fs.outputFile(path.join(outputDir, `${fileName}.vue`), component);
        await fs.outputFile(path.join(outputDir, `${fileName}.d.ts`), componentDefinition);
        await fs.outputFile(path.join(outputDir, `${fileName}.js`), jsCode);

        exports += `export { default as ${componentName} } from './${fileName}.vue';\n`;
        definition += `export const ${componentName}: Icon;\n`;
      }
    }
  };

  await Promise.all(sourceDirs.map((sourceDir) => action(sourceDir)));

  await fs.outputFile(path.join(outputDir, 'index.js'), exports);
  await fs.outputFile(path.join(outputDir, 'index.d.ts'), definition);
  await fs.outputFile(
    path.join(outputDir, 'icons.json'),
    JSON.stringify(iconSet, null, 2)
  );
})();
