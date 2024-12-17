"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PngIcon = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const air_gap_png_1 = __importDefault(require("../../assets/icons/air-gap.png"));
const altme_png_1 = __importDefault(require("../../assets/icons/altme.png"));
const bitget_png_1 = __importDefault(require("../../assets/icons/bitget.png"));
const etherlink_png_1 = __importDefault(require("../../assets/icons/etherlink.png"));
const kukai_png_1 = __importDefault(require("../../assets/icons/kukai.png"));
const meta_mask_png_1 = __importDefault(require("../../assets/icons/meta-mask.png"));
const safe_pal_png_1 = __importDefault(require("../../assets/icons/safe-pal.png"));
const temple_png_1 = __importDefault(require("../../assets/icons/temple.png"));
const tezos_png_1 = __importDefault(require("../../assets/icons/tezos.png"));
const transparent_png_1 = __importDefault(require("../../assets/icons/transparent.png"));
const trust_png_1 = __importDefault(require("../../assets/icons/trust.png"));
const utils_1 = require("../../utils");
exports.PngIcon = (0, react_1.memo)(({ icon, height, width, className, ...props }) => {
    const src = (0, react_1.useMemo)(() => {
        switch (icon) {
            case 'airGap': {
                return air_gap_png_1.default;
            }
            case 'altme': {
                return altme_png_1.default;
            }
            case 'bitget': {
                return bitget_png_1.default;
            }
            case 'etherlink': {
                return etherlink_png_1.default;
            }
            case 'kukai': {
                return kukai_png_1.default;
            }
            case 'metaMask': {
                return meta_mask_png_1.default;
            }
            case 'safePal': {
                return safe_pal_png_1.default;
            }
            case 'temple': {
                return temple_png_1.default;
            }
            case 'tezos': {
                return tezos_png_1.default;
            }
            case 'transparent': {
                return transparent_png_1.default;
            }
            case 'trust': {
                return trust_png_1.default;
            }
        }
    }, [icon]);
    return (0, jsx_runtime_1.jsx)("img", { src: src, style: { height, width }, className: (0, utils_1.tw)('border-box', className), ...props });
});
exports.PngIcon.displayName = 'PngIcon';
//# sourceMappingURL=PngIcon.js.map