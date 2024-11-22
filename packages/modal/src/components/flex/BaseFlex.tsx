import { forwardRef, HTMLAttributes, memo } from 'react';
import { tw } from '../../utils';

export type BaseFlexProps = HTMLAttributes<HTMLDivElement>;

/**
 * `BaseFlex` is a memoized functional component that renders a flexible box container.
 * It uses `forwardRef` to pass down a ref to the underlying `div` element.
 *
 * @param {BaseFlexProps} props - The properties passed to the component.
 * @param {React.ReactNode} props.children - The child elements to be rendered inside the flex container.
 * @param {string} [props.className] - Additional class names to apply to the flex container.
 * @param {React.Ref<HTMLDivElement>} ref - The ref to be forwarded to the `div` element.
 *
 * @returns {JSX.Element} The rendered flex container.
 */
export const BaseFlex = memo(
	forwardRef<HTMLDivElement, BaseFlexProps>(({ children, className, ...props }, ref) => (
		<div ref={ref} className={tw('box-border flex', className)} {...props}>
			{children}
		</div>
	)),
);

BaseFlex.displayName = 'BaseFlex';
