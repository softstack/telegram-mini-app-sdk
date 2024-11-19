"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Icon = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const PngIcon_1 = require("./PngIcon");
const SvgIcon_1 = require("./SvgIcon");
exports.Icon = (0, react_1.memo)(({ icon, ...props }) => {
    const isPngIcon = (0, react_1.useMemo)(() => {
        switch (icon) {
            case 'airGap':
            case 'altme':
            case 'bitget':
            case 'etherlink':
            case 'kukai':
            case 'metaMask':
            case 'rainbow':
            case 'safePal':
            case 'temple':
            case 'tezos':
            case 'transparent':
            case 'trust': {
                return true;
            }
            default: {
                return false;
            }
        }
    }, [icon]);
    if (isPngIcon) {
        return (0, jsx_runtime_1.jsx)(PngIcon_1.PngIcon, { icon: icon, ...props });
    }
    return (0, jsx_runtime_1.jsx)(SvgIcon_1.SvgIcon, { icon: icon, ...props });
});
exports.Icon.displayName = 'Icon';
//# sourceMappingURL=Icon.js.map