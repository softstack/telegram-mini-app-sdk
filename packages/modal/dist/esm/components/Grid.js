import { jsx as _jsx } from "react/jsx-runtime";
import { memo } from 'react';
import { tw } from '../utils';
export const Grid = memo(({ className, children, ...props }) => (_jsx("div", { className: tw('grid', className), ...props, children: children })));
Grid.displayName = 'Grid';
//# sourceMappingURL=Grid.js.map