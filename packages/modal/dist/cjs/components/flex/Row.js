"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Row = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const clsx_1 = require("clsx");
const react_1 = require("react");
const BaseFlex_1 = require("./BaseFlex");
exports.Row = (0, react_1.memo)((0, react_1.forwardRef)(({ children, className, ...props }) => ((0, jsx_runtime_1.jsx)(BaseFlex_1.BaseFlex, { className: (0, clsx_1.clsx)('flex-row', className), ...props, children: children }))));
exports.Row.displayName = 'Row';
//# sourceMappingURL=Row.js.map