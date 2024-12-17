"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CopyButton = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const clsx_1 = require("clsx");
const react_1 = require("react");
const Row_1 = require("../flex/Row");
const Icon_1 = require("../icons/Icon");
const BaseButton_1 = require("./BaseButton");
exports.CopyButton = (0, react_1.memo)(({ text, className, ...props }) => {
    const [copied, setCopied] = (0, react_1.useState)(false);
    const handleCopy = (0, react_1.useCallback)(() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 1500);
    }, [text]);
    return ((0, jsx_runtime_1.jsxs)(BaseButton_1.BaseButton, { className: (0, clsx_1.clsx)('flex-row items-center gap-x-1.5 py-1', className), onClick: handleCopy, ...props, children: [(0, jsx_runtime_1.jsx)(Row_1.Row, { className: "h-[20px] w-[20px]", children: (0, jsx_runtime_1.jsx)(Icon_1.Icon, { icon: copied ? 'checkSolid' : 'copyRegular', className: (0, clsx_1.clsx)(copied && 'text-success'), height: 20, width: 20 }) }), (0, jsx_runtime_1.jsx)(Row_1.Row, { className: "break-all", children: text })] }));
});
exports.CopyButton.displayName = 'CopyButton';
//# sourceMappingURL=CopyButton.js.map