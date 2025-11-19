"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const svgo_1 = __importDefault(require("svgo"));
const core_1 = require("@babel/core");
const svgo_config_1 = __importDefault(require("./svgo.config"));
const utils_1 = require("./utils");
const outputDir = path_1.default.join(__dirname, '../', 'dist');
const sourceDirs = [
    path_1.default.join(__dirname, '../', 'source'),
    path_1.default.join(__dirname, '../', 'fill'),
    path_1.default.join(__dirname, '../', 'duotone'),
];
const primaryColor = '#324558';
const parseSvg = (svg) => {
    let newSvg = svg.replace(/-([a-z])(?=[a-z\-]*[=\s/>])/g, (g) => g[1].toUpperCase());
    newSvg = newSvg.replace(/<svg([^>]+)>/, `<svg$1 
      fill="#b6c2cd" 
      color="#324558"
      :width="size"
      :height="size"
      :class="classes"
      ref="svgRef"
      v-bind="attrs"
    >`);
    return newSvg;
};
exports.default = (() => __awaiter(void 0, void 0, void 0, function* () {
    yield fs_extra_1.default.remove(outputDir);
    const svgo = new svgo_1.default(svgo_config_1.default);
    let exports = '';
    let definition = (0, utils_1.makeBasicDefinition)();
    const iconSet = {};
    const action = (sourceDir) => __awaiter(void 0, void 0, void 0, function* () {
        const dirs = fs_extra_1.default.readdirSync(sourceDir);
        for (const dir of dirs) {
            const dirStat = fs_extra_1.default.lstatSync(`${sourceDir}/${dir}`);
            if (!dirStat.isDirectory())
                continue;
            iconSet[dir] = [];
            const files = fs_extra_1.default.readdirSync(`${sourceDir}/${dir}`);
            for (const file of files) {
                const componentName = (0, utils_1.toComponentName)(file.split('.')[0]);
                const fileName = (0, utils_1.toHumpName)(file.split('.')[0]);
                iconSet[dir].push(componentName);
                const fileContent = fs_extra_1.default.readFileSync(`${sourceDir}/${dir}/${file}`);
                const { data } = yield svgo.optimize(fileContent);
                const optimizedSvgString = data.replace(new RegExp(`${primaryColor}`, 'g'), 'currentColor');
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
                const jsCode = (0, core_1.transform)(`export { default } from './${fileName}.vue'`, utils_1.moduleBabelConfig).code;
                yield fs_extra_1.default.outputFile(path_1.default.join(outputDir, `${fileName}.vue`), component);
                yield fs_extra_1.default.outputFile(path_1.default.join(outputDir, `${fileName}.d.ts`), componentDefinition);
                yield fs_extra_1.default.outputFile(path_1.default.join(outputDir, `${fileName}.js`), jsCode);
                exports += `export { default as ${componentName} } from './${fileName}.vue';\n`;
                definition += `export const ${componentName}: Icon;\n`;
            }
        }
    });
    yield Promise.all(sourceDirs.map((sourceDir) => action(sourceDir)));
    const allModulesCode = (0, core_1.transform)(exports, utils_1.allModulesBabelConfig).code;
    yield fs_extra_1.default.outputFile(path_1.default.join(outputDir, 'index.js'), allModulesCode);
    yield fs_extra_1.default.outputFile(path_1.default.join(outputDir, 'index.d.ts'), definition);
    yield fs_extra_1.default.outputFile(path_1.default.join(outputDir, 'icons.json'), JSON.stringify(iconSet, null, 2));
}))();
