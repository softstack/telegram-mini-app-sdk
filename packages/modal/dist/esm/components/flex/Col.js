import { jsx as _jsx } from "react/jsx-runtime";
import { clsx } from 'clsx';
import { forwardRef, memo } from 'react';
import { BaseFlex } from './BaseFlex';
export const Col = memo(forwardRef(({ children, className, ...props }, ref) => (_jsx(BaseFlex, { ref: ref, className: clsx('flex-col', className), ...props, children: children }))));
Col.displayName = 'Col';
//# sourceMappingURL=Col.js.map