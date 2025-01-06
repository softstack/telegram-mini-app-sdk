import { jsx as _jsx } from "react/jsx-runtime";
import { memo, useMemo } from 'react';
import etherlink from '../../assets/networks/etherlink.png';
import tezos from '../../assets/networks/tezos.png';
import airGap from '../../assets/wallets/air-gap.png';
import altme from '../../assets/wallets/altme.png';
import bitget from '../../assets/wallets/bitget.png';
import kukai from '../../assets/wallets/kukai.png';
import metaMask from '../../assets/wallets/meta-mask.png';
import safePal from '../../assets/wallets/safe-pal.png';
import temple from '../../assets/wallets/temple.png';
import trust from '../../assets/wallets/trust.png';
import { tw } from '../../utils';
export const PngIcon = memo(({ icon, height, width, className, ...props }) => {
    const src = useMemo(() => {
        switch (icon) {
            case 'airGap': {
                return airGap;
            }
            case 'altme': {
                return altme;
            }
            case 'bitget': {
                return bitget;
            }
            case 'etherlink': {
                return etherlink;
            }
            case 'kukai': {
                return kukai;
            }
            case 'metaMask': {
                return metaMask;
            }
            case 'safePal': {
                return safePal;
            }
            case 'temple': {
                return temple;
            }
            case 'tezos': {
                return tezos;
            }
            case 'trust': {
                return trust;
            }
        }
    }, [icon]);
    return _jsx("img", { src: src, style: { height, width }, className: tw('border-box', className), ...props });
});
PngIcon.displayName = 'PngIcon';
//# sourceMappingURL=PngIcon.js.map