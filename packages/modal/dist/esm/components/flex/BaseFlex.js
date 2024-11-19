import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef, memo } from 'react';
import { tw } from '../../utils';
export const BaseFlex = memo(forwardRef(({ children, className, ...props }, ref) => (_jsx("div", { ref: ref, className: tw('box-border flex', className), ...props, children: children }))));
BaseFlex.displayName = 'BaseFlex';
//# sourceMappingURL=BaseFlex.js.map