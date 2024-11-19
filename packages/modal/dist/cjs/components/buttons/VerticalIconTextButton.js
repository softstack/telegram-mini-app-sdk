"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerticalIconTextButton = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const clsx_1 = require("clsx");
const react_1 = require("react");
const Row_1 = require("../flex/Row");
const Icon_1 = require("../icons/Icon");
const BaseButton_1 = require("./BaseButton");
exports.VerticalIconTextButton = (0, react_1.memo)(({ icon, text, className, ...props }) => ((0, jsx_runtime_1.jsxs)(BaseButton_1.BaseButton, { className: (0, clsx_1.clsx)('flex-col items-center justify-center gap-y-1.5', className), ...props, children: [(0, jsx_runtime_1.jsx)(Icon_1.Icon, { icon: icon, className: "rounded-[0.5rem] object-contain", height: 48, width: 48 }), (0, jsx_runtime_1.jsx)(Row_1.Row, { className: "text-xs", children: text })] })));
exports.VerticalIconTextButton.displayName = 'VerticalIconTextButton';
//# sourceMappingURL=VerticalIconTextButton.js.map