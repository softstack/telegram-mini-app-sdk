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

export const Icon = memo<IconProps>(({ icon, ...props }) => {
	const isPngIcon = useMemo(() => {
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
		return <PngIcon icon={icon as PngIconType} {...props} />;
	}
	return <SvgIcon icon={icon as SvgIconType} {...props} />;
});

Icon.displayName = 'Icon';
