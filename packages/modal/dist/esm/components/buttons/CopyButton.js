import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { clsx } from 'clsx';
import { memo, useCallback, useState } from 'react';
import { Row } from '../flex/Row';
import { Icon } from '../icons/Icon';
import { BaseButton } from './BaseButton';
export const CopyButton = memo(({ text, className, ...props }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 1500);
    }, [text]);
    return (_jsxs(BaseButton, { className: clsx('flex-row items-center gap-x-1.5 py-1', className), onClick: handleCopy, ...props, children: [_jsx(Row, { className: "h-[20px] w-[20px]", children: _jsx(Icon, { icon: copied ? 'checkSolid' : 'copyRegular', className: clsx(copied && 'text-success'), height: 20, width: 20 }) }), _jsx(Row, { className: "break-all", children: text })] }));
});
CopyButton.displayName = 'CopyButton';
//# sourceMappingURL=CopyButton.js.map