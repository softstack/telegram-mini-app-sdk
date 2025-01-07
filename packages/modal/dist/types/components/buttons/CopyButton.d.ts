import { BaseButtonProps } from './BaseButton';
export interface CopyButtonProps extends BaseButtonProps {
    text: string;
    value: string | undefined;
}
export declare const CopyButton: import("react").NamedExoticComponent<CopyButtonProps>;
