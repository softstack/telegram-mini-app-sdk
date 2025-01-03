"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Accordion = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const clsx_1 = require("clsx");
const react_1 = require("react");
const BaseButton_1 = require("./buttons/BaseButton");
const Col_1 = require("./flex/Col");
const Row_1 = require("./flex/Row");
const Grid_1 = require("./Grid");
const Icon_1 = require("./icons/Icon");
exports.Accordion = (0, react_1.memo)(({ title, open, onChangeOpen, className, children, ...props }) => {
    const [internalOpen, setInternalOpen] = (0, react_1.useState)(open ?? false);
    const toggleOpen = (0, react_1.useCallback)(() => {
        const newOpen = !(open ?? internalOpen);
        setInternalOpen(newOpen);
        onChangeOpen?.(newOpen);
    }, [open, internalOpen, onChangeOpen]);
    return ((0, jsx_runtime_1.jsxs)(Col_1.Col, { className: (0, clsx_1.clsx)('gap-y-4', className), ...props, children: [(0, jsx_runtime_1.jsxs)(Row_1.Row, { className: "justify-between", children: [(0, jsx_runtime_1.jsx)(Row_1.Row, { children: title }), (0, jsx_runtime_1.jsx)(BaseButton_1.BaseButton, { className: "border-line dark:border-lineDark bg-light size-6 items-center justify-center rounded-full border border-solid dark:bg-dark", onClick: toggleOpen, children: (0, jsx_runtime_1.jsx)(Icon_1.Icon, { icon: (open ?? internalOpen) ? 'chevronUpSolid' : 'chevronDownSolid', className: "text-icon dark:text-iconDark", height: 12, width: 12 }) })] }), (0, jsx_runtime_1.jsx)(Grid_1.Grid, { className: (0, clsx_1.clsx)('auto-rows-auto grid-cols-[repeat(auto-fill,minmax(4.313rem,1fr))] gap-1', !(open ?? internalOpen) && 'hidden'), children: children })] }));
});
exports.Accordion.displayName = 'Accordion';
//# sourceMappingURL=Accordion.js.map