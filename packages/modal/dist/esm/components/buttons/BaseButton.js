import { jsx as _jsx } from "react/jsx-runtime";
import { memo } from 'react';
import { tw } from '../../utils';
export const BaseButton = memo(({ children, className, ...props }) => (_jsx("button", { className: tw('border-box no-tap-highlight flex cursor-pointer border-none bg-transparent p-0 font-sans text-base text-inherit', className), ...props, children: children })));
BaseButton.displayName = 'BaseButton';
//# sourceMappingURL=BaseButton.js.map