import { clsx } from 'clsx';
import { forwardRef, memo } from 'react';
import { BaseFlex, BaseFlexProps } from './BaseFlex';

export type ColProps = BaseFlexProps;

export const Col = memo(
	forwardRef<HTMLDivElement, ColProps>(({ children, className, ...props }, ref) => (
		<BaseFlex ref={ref} className={clsx('flex-col', className)} {...props}>
			{children}
		</BaseFlex>
	)),
);

Col.displayName = 'Col';
