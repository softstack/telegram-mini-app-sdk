import { HTMLAttributes, memo, useMemo } from 'react';
import airGap from '../../assets/icons/air-gap.png';
import altme from '../../assets/icons/altme.png';
import bitget from '../../assets/icons/bitget.png';
import etherlink from '../../assets/icons/etherlink.png';
import kukai from '../../assets/icons/kukai.png';
import metaMask from '../../assets/icons/meta-mask.png';
import rainbow from '../../assets/icons/rainbow.png';
import safePal from '../../assets/icons/safe-pal.png';
import temple from '../../assets/icons/temple.png';
import tezos from '../../assets/icons/tezos.png';
import transparent from '../../assets/icons/transparent.png';
import trust from '../../assets/icons/trust.png';
import { PngIconType } from '../../types';
import { tw } from '../../utils';

export interface PngIconProps extends HTMLAttributes<HTMLImageElement> {
	icon: PngIconType;
	height: number;
	width: number;
}

export const PngIcon = memo<PngIconProps>(({ icon, height, width, className, ...props }) => {
	const src = useMemo<string>(() => {
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
			case 'rainbow': {
				return rainbow;
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
			case 'transparent': {
				return transparent;
			}
			case 'trust': {
				return trust;
			}
		}
	}, [icon]);

	return <img src={src} style={{ height, width }} className={tw('border-box', className)} {...props} />;
});

PngIcon.displayName = 'PngIcon';
