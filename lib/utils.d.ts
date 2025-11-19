export declare const moduleBabelConfig: {
    presets: string[];
    plugins: (string | (string | {
        loose: boolean;
    })[])[];
    minified: boolean;
};
export declare const allModulesBabelConfig: {
    presets: string[];
    minified: boolean;
};
export declare const replaceAll: (target: string, find: string, replace: string) => string;
export declare const toHumpName: (name: string) => string;
export declare const toComponentName: (name: string) => string;
export declare const makeBasicDefinition: () => string;
//# sourceMappingURL=utils.d.ts.map