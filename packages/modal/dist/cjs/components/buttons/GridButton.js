"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridButton = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const clsx_1 = require("clsx");
const react_1 = require("react");
const VerticalIconTextButton_1 = require("./VerticalIconTextButton");
exports.GridButton = (0, react_1.memo)(({ selected, className, ...props }) => ((0, jsx_runtime_1.jsx)(VerticalIconTextButton_1.VerticalIconTextButton, { className: (0, clsx_1.clsx)('rounded-[10px] py-2', selected && 'bg-[#b9c1f4] font-bold dark:bg-[#60557e]', className), ...props })));
exports.GridButton.displayName = 'GridButton';
//# sourceMappingURL=GridButton.js.map