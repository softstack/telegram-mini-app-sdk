"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseButton = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const utils_1 = require("../../utils");
exports.BaseButton = (0, react_1.memo)(({ children, className, ...props }) => ((0, jsx_runtime_1.jsx)("button", { className: (0, utils_1.tw)('border-box no-tap-highlight flex cursor-pointer border-none bg-transparent p-0 font-sans text-base text-inherit', className), ...props, children: children })));
exports.BaseButton.displayName = 'BaseButton';
//# sourceMappingURL=BaseButton.js.map