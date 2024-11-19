"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseFlex = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const utils_1 = require("../../utils");
exports.BaseFlex = (0, react_1.memo)((0, react_1.forwardRef)(({ children, className, ...props }, ref) => ((0, jsx_runtime_1.jsx)("div", { ref: ref, className: (0, utils_1.tw)('box-border flex', className), ...props, children: children }))));
exports.BaseFlex.displayName = 'BaseFlex';
//# sourceMappingURL=BaseFlex.js.map