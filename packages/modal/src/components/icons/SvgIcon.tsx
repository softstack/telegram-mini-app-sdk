import { FC, memo, SVGProps, useCallback, useEffect, useState } from 'react';
import Svg, { Props } from 'react-inlinesvg';
import arrowRotateRightSolid from '../../assets/icons/arrow-rotate-right-solid.svg';
import checkSolid from '../../assets/icons/check-solid.svg';
import chevronDownSolid from '../../assets/icons/chevron-down-solid.svg';
import chevronLeftSolid from '../../assets/icons/chevron-left-solid.svg';
import chevronUpSolid from '../../assets/icons/chevron-up-solid.svg';
import copyRegular from '../../assets/icons/copy-regular.svg';
import fileLinesRegular from '../../assets/icons/file-lines-regular.svg';
import linkSolid from '../../assets/icons/link-solid.svg';
import plusSolid from '../../assets/icons/plus-solid.svg';
import xmarkSolid from '../../assets/icons/xmark-solid.svg';
import { SvgIconType } from '../../types';
import { tw } from '../../utils';

const SvgComponent = Svg as FC<Props>;

const getSrc = (icon: SvgIconType): string => {
	switch (icon) {
		case 'arrowRotateRightSolid': {
			return arrowRotateRightSolid;
		}
		case 'checkSolid': {
			return checkSolid;
		}
		case 'chevronDownSolid': {
			return chevronDownSolid;
		}
		case 'chevronLeftSolid': {
			return chevronLeftSolid;
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
		case 'linkSolid': {
			return linkSolid;
		}
		case 'plusSolid': {
			return plusSolid;
		}
		case 'xmarkSolid': {
			return xmarkSolid;
		}
	}
};

export interface SvgIconProps extends Omit<SVGProps<SVGElement>, 'onLoad' | 'onError' | 'ref'> {
	icon: SvgIconType;
}

/**
 * SvgIcon component is a memoized functional component that renders an SVG icon.
 * It manages the loading state of the SVG source and updates the source when the icon prop changes.
 *
 * @param {SvgIconProps} props - The properties for the SvgIcon component.
 * @param {string} props.icon - The name or path of the SVG icon to be displayed.
 * @param {string} [props.className] - Optional additional class names to apply to the SVG element.
 * @param {object} [props.props] - Additional properties to be spread onto the SVG element.
 *
 * @returns {JSX.Element} The rendered SVG icon component.
 */
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
