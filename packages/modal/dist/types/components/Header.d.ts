import { RowProps } from './flex/Row';
export interface HeaderProps extends RowProps {
    title: string;
    onClose: () => void;
}
export declare const Header: import("react").NamedExoticComponent<HeaderProps>;
