import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { clsx } from 'clsx';
import { memo, useCallback, useState } from 'react';
import { BaseButton } from './buttons/BaseButton';
import { Col } from './flex/Col';
import { Row } from './flex/Row';
import { Icon } from './icons/Icon';
export const EtherlinkField = memo(({ label, value }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 1500);
    }, [value]);
    return (_jsxs(Col, { className: "", children: [_jsx(Row, { className: "text-sm", children: label }), _jsxs(BaseButton, { className: "flex-row items-center gap-x-1.5 py-1", onClick: handleCopy, children: [_jsx(Icon, { icon: copied ? 'checkSolid' : 'copyRegular', className: clsx(copied && 'text-success'), height: 20, width: 20 }), _jsx(Row, { className: "break-all", children: value })] })] }));
});
EtherlinkField.displayName = 'EtherlinkField';
//# sourceMappingURL=EtherlinkField.js.map