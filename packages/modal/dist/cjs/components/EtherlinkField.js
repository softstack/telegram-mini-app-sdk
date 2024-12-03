"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EtherlinkField = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const clsx_1 = require("clsx");
const react_1 = require("react");
const BaseButton_1 = require("./buttons/BaseButton");
const Col_1 = require("./flex/Col");
const Row_1 = require("./flex/Row");
const Icon_1 = require("./icons/Icon");
exports.EtherlinkField = (0, react_1.memo)(({ label, value }) => {
    const [copied, setCopied] = (0, react_1.useState)(false);
    const handleCopy = (0, react_1.useCallback)(() => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 1500);
    }, [value]);
    return ((0, jsx_runtime_1.jsxs)(Col_1.Col, { className: "", children: [(0, jsx_runtime_1.jsx)(Row_1.Row, { className: "text-sm", children: label }), (0, jsx_runtime_1.jsxs)(BaseButton_1.BaseButton, { className: "flex-row items-center gap-x-1.5 py-1", onClick: handleCopy, children: [(0, jsx_runtime_1.jsx)(Icon_1.Icon, { icon: copied ? 'checkSolid' : 'copyRegular', className: (0, clsx_1.clsx)(copied && 'text-success'), height: 20, width: 20 }), (0, jsx_runtime_1.jsx)(Row_1.Row, { className: "break-all", children: value })] })] }));
});
exports.EtherlinkField.displayName = 'EtherlinkField';
//# sourceMappingURL=EtherlinkField.js.map