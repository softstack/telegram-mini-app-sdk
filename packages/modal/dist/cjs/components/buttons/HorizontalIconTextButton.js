"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HorizontalIconTextButton = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const clsx_1 = require("clsx");
const react_1 = require("react");
const Row_1 = require("../flex/Row");
const Icon_1 = require("../icons/Icon");
const BaseButton_1 = require("./BaseButton");
exports.HorizontalIconTextButton = (0, react_1.memo)(({ icon, text, className, ...props }) => ((0, jsx_runtime_1.jsxs)(BaseButton_1.BaseButton, { className: (0, clsx_1.clsx)('h-5 flex-row items-center justify-center gap-x-1.5', className), ...props, children: [(0, jsx_runtime_1.jsx)(Row_1.Row, { className: "h-[16px] w-[20px]", children: (0, jsx_runtime_1.jsx)(Icon_1.Icon, { icon: icon, height: 16, width: 20 }) }), (0, jsx_runtime_1.jsx)(Row_1.Row, { children: text })] })));
exports.HorizontalIconTextButton.displayName = 'HorizontalIconTextButton';
//# sourceMappingURL=HorizontalIconTextButton.js.map