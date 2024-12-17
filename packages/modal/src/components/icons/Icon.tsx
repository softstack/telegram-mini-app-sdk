import { memo, useMemo } from 'react';
import { IconType, PngIconType, SvgIconType } from '../../types';
import { PngIcon } from './PngIcon';
import { SvgIcon } from './SvgIcon';

export interface IconProps {
	icon: IconType;
	height: number;
	width: number;
	className?: string;
}

/**
 * A memoized functional component that renders an icon based on the provided `icon` prop.
 * It determines whether the icon is a PNG or SVG and renders the appropriate component.
 *
 * @param {IconProps} props - The properties for the Icon component.
 * @param {string} props.icon - The name of the icon to be rendered.
 * @returns {JSX.Element} The rendered icon component, either a `PngIcon` or `SvgIcon`.
 */
export const Icon = memo<IconProps>(({ icon, ...props }) => {
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
		return <PngIcon icon={icon as PngIconType} {...props} />;
	}
	return <SvgIcon icon={icon as SvgIconType} {...props} />;
});

Icon.displayName = 'Icon';
