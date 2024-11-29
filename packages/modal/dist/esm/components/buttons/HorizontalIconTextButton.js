import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { clsx } from 'clsx';
import { memo } from 'react';
import { Row } from '../flex/Row';
import { Icon } from '../icons/Icon';
import { BaseButton } from './BaseButton';
export const HorizontalIconTextButton = memo(({ icon, iconColorSuccess, text, className, ...props }) => (_jsxs(BaseButton, { className: clsx('h-5 flex-row items-center justify-center gap-x-1.5 text-lineGrey', className), ...props, children: [_jsx(Icon, { className: clsx(iconColorSuccess && 'text-success'), icon: icon, height: 20, width: 20 }), _jsx(Row, { className: "text-xs text-primaryText dark:text-primaryTextDark", children: text })] })));
HorizontalIconTextButton.displayName = 'HorizontalIconTextButton';
//# sourceMappingURL=HorizontalIconTextButton.js.map