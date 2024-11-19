import { forwardRef, HTMLAttributes, memo } from 'react';
import { twMerge } from 'tailwind-merge';

export type BaseFlexProps = HTMLAttributes<HTMLDivElement>;

export const BaseFlex = memo(
	forwardRef<HTMLDivElement, BaseFlexProps>(({ children, className, ...props }, ref) => (
		<div ref={ref} className={twMerge('box-border flex', className)} {...props}>
			{children}
		</div>
	)),
);

BaseFlex.displayName = 'BaseFlex';
