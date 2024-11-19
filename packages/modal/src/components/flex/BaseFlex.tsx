import { forwardRef, HTMLAttributes, memo } from 'react';
import { tw } from '../../utils';

export type BaseFlexProps = HTMLAttributes<HTMLDivElement>;

export const BaseFlex = memo(
	forwardRef<HTMLDivElement, BaseFlexProps>(({ children, className, ...props }, ref) => (
		<div ref={ref} className={tw('box-border flex', className)} {...props}>
			{children}
		</div>
	)),
);

BaseFlex.displayName = 'BaseFlex';
