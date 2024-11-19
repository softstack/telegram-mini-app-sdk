import { FC, memo, SVGProps, useCallback, useEffect, useState } from 'react';
import Svg, { Props } from 'react-inlinesvg';
import chevronDownSolid from '../../assets/icons/chevron-down-solid.svg';
import chevronUpSolid from '../../assets/icons/chevron-up-solid.svg';
import copyRegular from '../../assets/icons/copy-regular.svg';
import fileLinesRegular from '../../assets/icons/file-lines-regular.svg';
import xmarkSolid from '../../assets/icons/xmark-solid.svg';
import { SvgIconType } from '../../types';
import { tw } from '../../utils';

const SvgComponent = Svg as FC<Props>;

const getSrc = (icon: SvgIconType): string => {
	switch (icon) {
		case 'chevronDownSolid': {
			return chevronDownSolid;
		}
		case 'chevronUpSolid': {
			return chevronUpSolid;
		}
		case 'copyRegular': {
			return copyRegular;
		}
		case 'fileLinesRegular': {
			return fileLinesRegular;
		}
		case 'xmarkSolid': {
			return xmarkSolid;
		}
	}
};

export interface SvgIconProps extends Omit<SVGProps<SVGElement>, 'onLoad' | 'onError' | 'ref'> {
	icon: SvgIconType;
}

export const SvgIcon = memo<SvgIconProps>(({ icon, className, ...props }) => {
	const [src, setSrc] = useState(getSrc(icon));
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (isLoading || getSrc(icon) === src) {
			return;
		}
		setSrc(getSrc(icon));
		setIsLoading(true);
	}, [isLoading, src, icon]);

	const handleLoad = useCallback(() => {
		setIsLoading(false);
	}, []);

	return <SvgComponent src={src} className={tw('border-box', className)} onLoad={handleLoad} {...props} />;
});

SvgIcon.displayName = 'SvgIcon';
