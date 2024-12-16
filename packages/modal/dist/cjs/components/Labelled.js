"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Labelled = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const Col_1 = require("./flex/Col");
const Row_1 = require("./flex/Row");
exports.Labelled = (0, react_1.memo)(({ children, label, ...props }) => {
    return ((0, jsx_runtime_1.jsxs)(Col_1.Col, { ...props, children: [(0, jsx_runtime_1.jsx)(Row_1.Row, { className: "text-xs", children: label }), children] }));
});
exports.Labelled.displayName = 'Labelled';
//# sourceMappingURL=Labelled.js.map