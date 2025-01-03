import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { clsx } from 'clsx';
import { memo, useCallback, useMemo, useState } from 'react';
import { Row } from '../flex/Row';
import { Icon } from '../icons/Icon';
import { BaseButton } from './BaseButton';
export const CopyButton = memo(({ text, value, className, ...props }) => {
    const [copied, setCopied] = useState(undefined);
    const handleCopy = useCallback(() => {
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
    const copyIcon = useMemo(() => {
        switch (copied) {
            case 'error':
                return 'xmarkSolid';
            case 'success':
                return 'checkSolid';
            default:
                return 'copyRegular';
        }
    }, [copied]);
    return (_jsxs(BaseButton, { className: clsx('flex-row items-center gap-x-1.5 py-1', className), onClick: handleCopy, ...props, children: [_jsx(Row, { className: "h-[20px] w-[20px]", children: _jsx(Icon, { icon: copyIcon, className: clsx(copied === 'error' ? 'text-error' : copied === 'success' ? 'text-success' : undefined), height: 20, width: 20 }) }), _jsx(Row, { className: "break-all", children: text })] }));
});
CopyButton.displayName = 'CopyButton';
//# sourceMappingURL=CopyButton.js.map