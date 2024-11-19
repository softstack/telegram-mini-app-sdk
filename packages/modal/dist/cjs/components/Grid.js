"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Grid = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const utils_1 = require("../utils");
exports.Grid = (0, react_1.memo)(({ className, children, ...props }) => ((0, jsx_runtime_1.jsx)("div", { className: (0, utils_1.tw)('grid', className), ...props, children: children })));
exports.Grid.displayName = 'Grid';
//# sourceMappingURL=Grid.js.map