import { HTMLAttributes, memo } from 'react';
import { tw } from '../utils';

export type GridProps = HTMLAttributes<HTMLDivElement>;

export const Grid = memo<GridProps>(({ className, children, ...props }) => (
	<div className={tw('grid', className)} {...props}>
		{children}
	</div>
));

Grid.displayName = 'Grid';
