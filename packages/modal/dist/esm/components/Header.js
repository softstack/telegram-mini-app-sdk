import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { clsx } from 'clsx';
import { memo } from 'react';
import { BaseButton } from './buttons/BaseButton';
import { Row } from './flex/Row';
import { Icon } from './icons/Icon';
export const Header = memo(({ onBack, title, onClose, className }) => (_jsxs(Row, { className: clsx('border-line min-h-[3.625rem] items-center justify-between border-x-0 border-y border-t-0 border-solid px-pageFrame', className), children: [onBack ? (_jsx(BaseButton, { className: "size-6 items-center justify-center", onClick: onBack, children: _jsx(Icon, { icon: "chevronLeftSolid", className: "text-icon dark:text-iconDark", height: 14, width: 14 }) })) : (_jsx(Row, { className: "size-6" })), _jsx(Row, { className: "text-[1.25rem] font-bold", children: title }), _jsx(BaseButton, { className: "size-6 items-center justify-center", onClick: onClose, children: _jsx(Icon, { icon: "xmarkSolid", className: "text-icon dark:text-iconDark", height: 14, width: 14 }) })] })));
Header.displayName = 'Header';
//# sourceMappingURL=Header.js.map