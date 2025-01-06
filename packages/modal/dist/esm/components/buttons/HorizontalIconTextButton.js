import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { clsx } from 'clsx';
import { memo } from 'react';
import { Row } from '../flex/Row';
import { Icon } from '../icons/Icon';
import { BaseButton } from './BaseButton';
export const HorizontalIconTextButton = memo(({ icon, text, className, ...props }) => (_jsxs(BaseButton, { className: clsx('h-5 flex-row items-center justify-center gap-x-1.5', className), ...props, children: [_jsx(Row, { className: "h-[16px] w-[20px]", children: _jsx(Icon, { icon: icon, height: 16, width: 20 }) }), _jsx(Row, { children: text })] })));
HorizontalIconTextButton.displayName = 'HorizontalIconTextButton';
//# sourceMappingURL=HorizontalIconTextButton.js.map