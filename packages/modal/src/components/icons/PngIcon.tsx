import { HTMLAttributes, memo, useMemo } from 'react';
import airGap from '../../assets/icons/air-gap.png';
import altme from '../../assets/icons/altme.png';
import bitget from '../../assets/icons/bitget.png';
import etherlink from '../../assets/icons/etherlink.png';
import kukai from '../../assets/icons/kukai.png';
import metaMask from '../../assets/icons/meta-mask.png';
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

/**
 * A memoized functional component that renders an image based on the provided icon name.
 *
 * @param {PngIconProps} props - The properties for the PngIcon component.
 * @param {string} props.icon - The name of the icon to be displayed. Possible values are:
 *   'airGap', 'altme', 'bitget', 'etherlink', 'kukai', 'metaMask', 'safePal', 'temple', 'tezos', 'transparent', 'trust'.
 * @param {string | number} props.height - The height of the image.
 * @param {string | number} props.width - The width of the image.
 * @param {string} [props.className] - Additional CSS classes to apply to the image.
 * @param {object} [props.props] - Additional properties to spread onto the img element.
 *
 * @returns {JSX.Element} The rendered img element with the specified icon.
 */
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
