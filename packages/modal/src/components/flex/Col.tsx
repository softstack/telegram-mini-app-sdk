import { clsx } from 'clsx';
import { forwardRef, memo } from 'react';
import { BaseFlex, BaseFlexProps } from './BaseFlex';

export type ColProps = BaseFlexProps;

/**
 * `Col` is a memoized and forward-ref component that renders its children
 * inside a `BaseFlex` component with a `flex-col` class.
 *
 * @param {ColProps} props - The properties passed to the component.
 * @param {React.ReactNode} props.children - The child elements to be rendered inside the column.
 * @param {string} [props.className] - Additional class names to apply to the column.
 * @param {React.Ref<HTMLDivElement>} ref - The ref to be forwarded to the `BaseFlex` component.
 *
 * @returns {JSX.Element} The rendered column component.
 */
export const Col = memo(
	forwardRef<HTMLDivElement, ColProps>(({ children, className, ...props }, ref) => (
		<BaseFlex ref={ref} className={clsx('flex-col', className)} {...props}>
			{children}
		</BaseFlex>
	)),
);

Col.displayName = 'Col';
