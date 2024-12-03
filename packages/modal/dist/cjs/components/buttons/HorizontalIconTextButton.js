"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HorizontalIconTextButton = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const clsx_1 = require("clsx");
const react_1 = require("react");
const Row_1 = require("../flex/Row");
const Icon_1 = require("../icons/Icon");
const BaseButton_1 = require("./BaseButton");
exports.HorizontalIconTextButton = (0, react_1.memo)(({ icon, iconColorSuccess, text, className, ...props }) => ((0, jsx_runtime_1.jsxs)(BaseButton_1.BaseButton, { className: (0, clsx_1.clsx)('h-5 flex-row items-center justify-center gap-x-1.5 text-lineGrey', className), ...props, children: [(0, jsx_runtime_1.jsx)(Icon_1.Icon, { className: (0, clsx_1.clsx)(iconColorSuccess && 'text-success'), icon: icon, height: 20, width: 20 }), (0, jsx_runtime_1.jsx)(Row_1.Row, { className: "text-xs text-primaryText dark:text-primaryTextDark", children: text })] })));
exports.HorizontalIconTextButton.displayName = 'HorizontalIconTextButton';
//# sourceMappingURL=HorizontalIconTextButton.js.map