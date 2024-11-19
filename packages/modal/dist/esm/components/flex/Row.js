import { jsx as _jsx } from "react/jsx-runtime";
import { clsx } from 'clsx';
import { forwardRef, memo } from 'react';
import { BaseFlex } from './BaseFlex';
export const Row = memo(forwardRef(({ children, className, ...props }) => (_jsx(BaseFlex, { className: clsx('flex-row', className), ...props, children: children }))));
Row.displayName = 'Row';
//# sourceMappingURL=Row.js.map