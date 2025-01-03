import { jsx as _jsx } from "react/jsx-runtime";
import { clsx } from 'clsx';
import { memo } from 'react';
import { BaseButton } from './BaseButton';
export const TextButton = memo(({ text, className, ...props }) => (_jsx(BaseButton, { className: clsx('border-line items-center justify-center rounded-lg border border-solid p-4 text-primaryText dark:text-primaryTextDark', className), ...props, children: text })));
TextButton.displayName = 'TextButton';
//# sourceMappingURL=TextButton.js.map