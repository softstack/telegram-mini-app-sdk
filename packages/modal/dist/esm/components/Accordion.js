import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { clsx } from 'clsx';
import { memo, useCallback, useState } from 'react';
import { BaseButton } from './buttons/BaseButton';
import { Col } from './flex/Col';
import { Row } from './flex/Row';
import { Grid } from './Grid';
import { Icon } from './icons/Icon';
export const Accordion = memo(({ title, open, onChangeOpen, className, children, ...props }) => {
    const [internalOpen, setInternalOpen] = useState(open ?? false);
    const toggleOpen = useCallback(() => {
        const newOpen = !(open ?? internalOpen);
        setInternalOpen(newOpen);
        onChangeOpen?.(newOpen);
    }, [open, internalOpen, onChangeOpen]);
    return (_jsxs(Col, { className: clsx('gap-y-4', className), ...props, children: [_jsxs(Row, { className: "justify-between", children: [_jsx(Row, { children: title }), _jsx(BaseButton, { className: "size-6 items-center justify-center rounded-full border border-solid border-line bg-light dark:border-lineDark dark:bg-dark", onClick: toggleOpen, children: _jsx(Icon, { icon: (open ?? internalOpen) ? 'chevronUpSolid' : 'chevronDownSolid', className: "text-icon dark:text-iconDark", height: 12, width: 12 }) })] }), _jsx(Grid, { className: clsx('auto-rows-auto grid-cols-[repeat(auto-fill,minmax(4.313rem,1fr))] gap-1', !(open ?? internalOpen) && 'hidden'), children: children })] }));
});
Accordion.displayName = 'Accordion';
//# sourceMappingURL=Accordion.js.map