import { IconType } from '../../types';
import { BaseButtonProps } from './BaseButton';
export interface HorizontalIconTextButtonProps extends BaseButtonProps {
    icon: IconType;
    text: string;
}
export declare const HorizontalIconTextButton: import("react").NamedExoticComponent<HorizontalIconTextButtonProps>;
