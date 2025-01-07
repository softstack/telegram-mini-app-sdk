"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SvgIcon = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_inlinesvg_1 = __importDefault(require("react-inlinesvg"));
const arrow_rotate_right_solid_svg_1 = __importDefault(require("../../assets/icons/arrow-rotate-right-solid.svg"));
const check_solid_svg_1 = __importDefault(require("../../assets/icons/check-solid.svg"));
const chevron_down_solid_svg_1 = __importDefault(require("../../assets/icons/chevron-down-solid.svg"));
const chevron_left_solid_svg_1 = __importDefault(require("../../assets/icons/chevron-left-solid.svg"));
const chevron_up_solid_svg_1 = __importDefault(require("../../assets/icons/chevron-up-solid.svg"));
const copy_regular_svg_1 = __importDefault(require("../../assets/icons/copy-regular.svg"));
const file_lines_regular_svg_1 = __importDefault(require("../../assets/icons/file-lines-regular.svg"));
const link_solid_svg_1 = __importDefault(require("../../assets/icons/link-solid.svg"));
const plus_solid_svg_1 = __importDefault(require("../../assets/icons/plus-solid.svg"));
const xmark_solid_svg_1 = __importDefault(require("../../assets/icons/xmark-solid.svg"));
const utils_1 = require("../../utils");
const SvgComponent = react_inlinesvg_1.default;
const getSrc = (icon) => {
    switch (icon) {
        case 'arrowRotateRightSolid': {
            return arrow_rotate_right_solid_svg_1.default;
        }
        case 'checkSolid': {
            return check_solid_svg_1.default;
        }
        case 'chevronDownSolid': {
            return chevron_down_solid_svg_1.default;
        }
        case 'chevronLeftSolid': {
            return chevron_left_solid_svg_1.default;
        }
        case 'chevronUpSolid': {
            return chevron_up_solid_svg_1.default;
        }
        case 'copyRegular': {
            return copy_regular_svg_1.default;
        }
        case 'fileLinesRegular': {
            return file_lines_regular_svg_1.default;
        }
        case 'linkSolid': {
            return link_solid_svg_1.default;
        }
        case 'plusSolid': {
            return plus_solid_svg_1.default;
        }
        case 'xmarkSolid': {
            return xmark_solid_svg_1.default;
        }
    }
};
exports.SvgIcon = (0, react_1.memo)(({ icon, className, ...props }) => {
    const [src, setSrc] = (0, react_1.useState)(getSrc(icon));
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        if (isLoading || getSrc(icon) === src) {
            return;
        }
        setSrc(getSrc(icon));
        setIsLoading(true);
    }, [isLoading, src, icon]);
    const handleLoad = (0, react_1.useCallback)(() => {
        setIsLoading(false);
    }, []);
    return (0, jsx_runtime_1.jsx)(SvgComponent, { src: src, className: (0, utils_1.tw)('border-box', className), onLoad: handleLoad, ...props });
});
exports.SvgIcon.displayName = 'SvgIcon';
//# sourceMappingURL=SvgIcon.js.map