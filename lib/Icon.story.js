"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.basic = void 0;
const React = __importStar(require("react"));
const Icons = __importStar(require("@kubed/icons"));
const styled_components_1 = __importDefault(require("styled-components"));
const icons_json_1 = __importDefault(require("../dist/icons.json"));
console.log(icons_json_1.default);
exports.default = {
    title: 'Icons/Icon',
    component: Icons,
};
const SectionTitle = styled_components_1.default.h2 `
  font-size: 16px;
  margin-bottom: 20px;
`;
const Section = styled_components_1.default.div `
  display: flex;
  flex-direction: column;
  margin-bottom: 40px;
`;
const SectionContent = styled_components_1.default.div `
  width: 100%;
  padding-left: 15px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(8rem, 1fr));
  grid-gap: 20px;
`;
const SectionItem = styled_components_1.default.div `
  display: flex;
  flex-direction: column;
  width: 100px;
  height: 100px;
  justify-content: center;
  align-items: center;
  border: 1px solid rgb(238, 239, 240);
  border-radius: 3px;

  .icon-name {
    margin-top: 10px;
    color: rgb(101, 109, 126);
  }
`;
const Icon = (_a, ref) => {
    var { name } = _a, rest = __rest(_a, ["name"]);
    // @ts-ignore
    const IconElement = Icons[name];
    if (!IconElement) {
        throw new Error(`Icon with name: ${name} was not found!`);
    }
    return <IconElement ref={ref} {...rest}/>;
};
const basic = () => {
    return (<>
      {Object.keys(icons_json_1.default).map((key) => {
            return (<Section key={key}>
            <SectionTitle>{key}</SectionTitle>
            <SectionContent>
              {icons_json_1.default[key].map((item) => (<SectionItem key={item}>
                  <Icon name={item} size={40}/>
                  <div className="icon-name">{item}</div>
                </SectionItem>))}
            </SectionContent>
          </Section>);
        })}
    </>);
};
exports.basic = basic;
