import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { clsx } from 'clsx';
import { memo } from 'react';
import { Row } from '../flex/Row';
import { Icon } from '../icons/Icon';
import { BaseButton } from './BaseButton';
export const VerticalIconTextButton = memo(({ icon, text, className, ...props }) => (_jsxs(BaseButton, { className: clsx('flex-col items-center justify-center gap-y-1.5', className), ...props, children: [_jsx(Icon, { icon: icon, className: "rounded-[0.5rem] object-contain", height: 48, width: 48 }), _jsx(Row, { className: "text-xs", children: text })] })));
VerticalIconTextButton.displayName = 'VerticalIconTextButton';
//# sourceMappingURL=VerticalIconTextButton.js.map