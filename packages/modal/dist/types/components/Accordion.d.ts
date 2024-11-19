import { ColProps } from './flex/Col';
export interface AccordionProps extends ColProps {
    title: string;
    open: boolean;
    onChangeOpen: (open: boolean) => void;
}
export declare const Accordion: import("react").NamedExoticComponent<AccordionProps>;
