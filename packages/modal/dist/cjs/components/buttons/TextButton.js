"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextButton = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const clsx_1 = require("clsx");
const react_1 = require("react");
const BaseButton_1 = require("./BaseButton");
exports.TextButton = (0, react_1.memo)(({ text, className, ...props }) => ((0, jsx_runtime_1.jsx)(BaseButton_1.BaseButton, { className: (0, clsx_1.clsx)('items-center justify-center rounded-lg border border-solid border-lineGrey p-4 text-primaryText dark:text-primaryTextDark', className), ...props, children: text })));
exports.TextButton.displayName = 'TextButton';
//# sourceMappingURL=TextButton.js.map