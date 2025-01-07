"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CopyButton = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const clsx_1 = require("clsx");
const react_1 = require("react");
const Row_1 = require("../flex/Row");
const Icon_1 = require("../icons/Icon");
const BaseButton_1 = require("./BaseButton");
exports.CopyButton = (0, react_1.memo)(({ text, value, className, ...props }) => {
    const [copied, setCopied] = (0, react_1.useState)(undefined);
    const handleCopy = (0, react_1.useCallback)(() => {
        try {
            if (value === undefined) {
                setCopied('error');
            }
            else {
                navigator.clipboard.writeText(value);
                setCopied('success');
            }
        }
        catch (error) {
            setCopied('error');
            throw error;
        }
        finally {
            setTimeout(() => {
                setCopied(undefined);
            }, 1500);
        }
    }, [value]);
    const copyIcon = (0, react_1.useMemo)(() => {
        switch (copied) {
            case 'error': {
                return 'xmarkSolid';
            }
            case 'success': {
                return 'checkSolid';
            }
            default: {
                return 'copyRegular';
            }
        }
    }, [copied]);
    return ((0, jsx_runtime_1.jsxs)(BaseButton_1.BaseButton, { className: (0, clsx_1.clsx)('flex-row items-center gap-x-1.5 py-1', className), onClick: handleCopy, ...props, children: [(0, jsx_runtime_1.jsx)(Row_1.Row, { className: "h-[16px] w-[16px]", children: (0, jsx_runtime_1.jsx)(Icon_1.Icon, { icon: copyIcon, className: (0, clsx_1.clsx)(copied === 'error' ? 'text-error' : copied === 'success' ? 'text-success' : undefined), height: 16, width: 16 }) }), (0, jsx_runtime_1.jsx)(Row_1.Row, { className: "break-all", children: text })] }));
});
exports.CopyButton.displayName = 'CopyButton';
//# sourceMappingURL=CopyButton.js.map