import { clsx } from 'clsx';
import { memo } from 'react';
import { VerticalIconTextButton, VerticalIconTextButtonProps } from './VerticalIconTextButton';

export interface GridButtonProps extends VerticalIconTextButtonProps {
	selected: boolean;
}

/**
 * `GridButton` is a memoized functional component that renders a `VerticalIconTextButton`
 * with additional styling based on the `selected` prop.
 *
 * @param {GridButtonProps} props - The properties passed to the component.
 * @param {boolean} props.selected - Determines if the button is selected, applying additional styles if true.
 * @param {string} [props.className] - Additional class names to apply to the button.
 * @returns {JSX.Element} The rendered `VerticalIconTextButton` component with applied styles and props.
 */
export const GridButton = memo<GridButtonProps>(({ selected, className, ...props }) => (
	<VerticalIconTextButton
		className={clsx('rounded-[10px] py-2', selected && 'bg-[#b9c1f4] font-bold dark:bg-[#60557e]', className)}
		{...props}
	/>
));

GridButton.displayName = 'GridButton';
