"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Header = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const clsx_1 = require("clsx");
const react_1 = require("react");
const BaseButton_1 = require("./buttons/BaseButton");
const Row_1 = require("./flex/Row");
const Icon_1 = require("./icons/Icon");
exports.Header = (0, react_1.memo)(({ onBack, title, onClose, className }) => ((0, jsx_runtime_1.jsxs)(Row_1.Row, { className: (0, clsx_1.clsx)('min-h-[3.625rem] items-center justify-between border-x-0 border-y border-t-0 border-solid border-line px-pageFrame', className), children: [onBack ? ((0, jsx_runtime_1.jsx)(BaseButton_1.BaseButton, { className: "h-11 w-6 items-center justify-center", onClick: onBack, children: (0, jsx_runtime_1.jsx)(Icon_1.Icon, { icon: "chevronLeftSolid", className: "text-icon dark:text-iconDark", height: 14, width: 14 }) })) : ((0, jsx_runtime_1.jsx)(Row_1.Row, { className: "w-6" })), (0, jsx_runtime_1.jsx)(Row_1.Row, { className: "text-[1.25rem] font-bold", children: title }), (0, jsx_runtime_1.jsx)(BaseButton_1.BaseButton, { className: "h-11 w-6 items-center justify-center", onClick: onClose, children: (0, jsx_runtime_1.jsx)(Icon_1.Icon, { icon: "xmarkSolid", className: "text-icon dark:text-iconDark", height: 14, width: 14 }) })] })));
exports.Header.displayName = 'Header';
//# sourceMappingURL=Header.js.map