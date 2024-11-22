import { clsx } from 'clsx';
import { forwardRef, memo } from 'react';
import { BaseFlex, BaseFlexProps } from './BaseFlex';

export type RowProps = BaseFlexProps;

/**
 * `Row` is a memoized functional component that uses `forwardRef` to pass down a ref to a `BaseFlex` component.
 * It renders its children within a `BaseFlex` component with a `flex-row` class and any additional class names provided.
 *
 * @param {RowProps} props - The properties passed to the `Row` component.
 * @param {React.ReactNode} props.children - The child elements to be rendered inside the `Row`.
 * @param {string} [props.className] - Additional class names to apply to the `Row`.
 * @param {React.Ref<HTMLDivElement>} ref - The ref to be forwarded to the `BaseFlex` component.
 *
 * @returns {JSX.Element} The rendered `Row` component.
 */
export const Row = memo(
	forwardRef<HTMLDivElement, RowProps>(({ children, className, ...props }) => (
		<BaseFlex className={clsx('flex-row', className)} {...props}>
			{children}
		</BaseFlex>
	)),
);

Row.displayName = 'Row';
