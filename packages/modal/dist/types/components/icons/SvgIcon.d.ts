import { SVGProps } from 'react';
import { SvgIconType } from '../../types';
export interface SvgIconProps extends Omit<SVGProps<SVGElement>, 'onLoad' | 'onError' | 'ref'> {
    icon: SvgIconType;
}
export declare const SvgIcon: import("react").NamedExoticComponent<SvgIconProps>;
