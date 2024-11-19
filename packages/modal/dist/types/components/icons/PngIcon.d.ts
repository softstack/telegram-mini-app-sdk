import { HTMLAttributes } from 'react';
import { PngIconType } from '../../types';
export interface PngIconProps extends HTMLAttributes<HTMLImageElement> {
    icon: PngIconType;
    height: number;
    width: number;
}
export declare const PngIcon: import("react").NamedExoticComponent<PngIconProps>;
