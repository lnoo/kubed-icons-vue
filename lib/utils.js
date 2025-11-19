"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeBasicDefinition = exports.toComponentName = exports.toHumpName = exports.replaceAll = exports.allModulesBabelConfig = exports.moduleBabelConfig = void 0;
exports.moduleBabelConfig = {
    presets: ['@babel/preset-env'],
    plugins: [
        ['@babel/plugin-proposal-object-rest-spread', { loose: true }],
        '@babel/plugin-transform-runtime',
    ],
    minified: true,
};
exports.allModulesBabelConfig = {
    presets: ['@babel/preset-env'],
    minified: true,
};
const replaceAll = (target, find, replace) => {
    return target.split(find).join(replace);
};
exports.replaceAll = replaceAll;
const toHumpName = (name) => {
    return name.replace(/[-_](.)/g, (g) => g[1].toUpperCase());
};
exports.toHumpName = toHumpName;
const toComponentName = (name) => {
    const first = name.slice(0, 1).toUpperCase();
    const last = (0, exports.toHumpName)(name.slice(1));
    return `${first}${last}`;
};
exports.toComponentName = toComponentName;
const makeBasicDefinition = () => {
    return `
import { DefineComponent } from 'vue';

export interface IconProps {
  color?: string;
  variant?: 'dark' | 'light' | 'coloured' | string;
  size?: number | string;
  className?: string;
}

export type Icon = DefineComponent<IconProps>;

`;
};
exports.makeBasicDefinition = makeBasicDefinition;
