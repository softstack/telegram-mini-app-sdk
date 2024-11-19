import { IconType } from '../../types';
import { BaseButtonProps } from './BaseButton';
export interface VerticalIconTextButtonProps extends BaseButtonProps {
    icon: IconType;
    text: string;
}
export declare const VerticalIconTextButton: import("react").NamedExoticComponent<VerticalIconTextButtonProps>;
