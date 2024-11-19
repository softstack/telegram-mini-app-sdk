import { jsx as _jsx } from "react/jsx-runtime";
import { clsx } from 'clsx';
import { memo } from 'react';
import { VerticalIconTextButton } from './VerticalIconTextButton';
export const GridButton = memo(({ selected, className, ...props }) => (_jsx(VerticalIconTextButton, { className: clsx('rounded-[10px] py-2', selected && 'bg-[#b9c1f4] font-bold dark:bg-[#60557e]', className), ...props })));
GridButton.displayName = 'GridButton';
//# sourceMappingURL=GridButton.js.map