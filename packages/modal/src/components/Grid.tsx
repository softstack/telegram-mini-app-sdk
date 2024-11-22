import { HTMLAttributes, memo } from 'react';
import { tw } from '../utils';

export type GridProps = HTMLAttributes<HTMLDivElement>;

/**
 * A memoized Grid component that renders a div with a grid layout.
 *
 * @param {GridProps} props - The properties for the Grid component.
 * @param {string} [props.className] - Additional class names to apply to the grid.
 * @param {React.ReactNode} props.children - The content to be rendered inside the grid.
 * @returns {JSX.Element} The rendered grid component.
 */
export const Grid = memo<GridProps>(({ className, children, ...props }) => (
	<div className={tw('grid', className)} {...props}>
		{children}
	</div>
));

Grid.displayName = 'Grid';
