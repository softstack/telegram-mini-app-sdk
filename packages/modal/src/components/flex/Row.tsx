import { clsx } from 'clsx';
import { forwardRef, memo } from 'react';
import { BaseFlex, BaseFlexProps } from './BaseFlex';

export type RowProps = BaseFlexProps;

export const Row = memo(
	forwardRef<HTMLDivElement, RowProps>(({ children, className, ...props }) => (
		<BaseFlex className={clsx('flex-row', className)} {...props}>
			{children}
		</BaseFlex>
	)),
);

Row.displayName = 'Row';
