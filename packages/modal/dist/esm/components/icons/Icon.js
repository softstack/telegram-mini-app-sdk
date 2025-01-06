import { jsx as _jsx } from "react/jsx-runtime";
import { memo, useMemo } from 'react';
import { PngIcon } from './PngIcon';
import { SvgIcon } from './SvgIcon';
export const Icon = memo(({ icon, ...props }) => {
    const isPngIcon = useMemo(() => {
        switch (icon) {
            case 'airGap':
            case 'altme':
            case 'bitget':
            case 'etherlink':
            case 'kukai':
            case 'metaMask':
            case 'safePal':
            case 'temple':
            case 'tezos':
            case 'trust': {
                return true;
            }
            default: {
                return false;
            }
        }
    }, [icon]);
    if (isPngIcon) {
        return _jsx(PngIcon, { icon: icon, ...props });
    }
    return _jsx(SvgIcon, { icon: icon, ...props });
});
Icon.displayName = 'Icon';
//# sourceMappingURL=Icon.js.map