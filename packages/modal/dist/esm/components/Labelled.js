import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { memo } from 'react';
import { Col } from './flex/Col';
import { Row } from './flex/Row';
export const Labelled = memo(({ children, label, ...props }) => {
    return (_jsxs(Col, { ...props, children: [_jsx(Row, { className: "text-xs", children: label }), children] }));
});
Labelled.displayName = 'Labelled';
//# sourceMappingURL=Labelled.js.map