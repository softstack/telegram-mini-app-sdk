"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Col = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const clsx_1 = require("clsx");
const react_1 = require("react");
const BaseFlex_1 = require("./BaseFlex");
exports.Col = (0, react_1.memo)((0, react_1.forwardRef)(({ children, className, ...props }, ref) => ((0, jsx_runtime_1.jsx)(BaseFlex_1.BaseFlex, { ref: ref, className: (0, clsx_1.clsx)('flex-col', className), ...props, children: children }))));
exports.Col.displayName = 'Col';
//# sourceMappingURL=Col.js.map