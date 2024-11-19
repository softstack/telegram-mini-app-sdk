import { clsx } from 'clsx';
import { memo } from 'react';
import { VerticalIconTextButton, VerticalIconTextButtonProps } from './VerticalIconTextButton';

export interface GridButtonProps extends VerticalIconTextButtonProps {
	selected: boolean;
}

export const GridButton = memo<GridButtonProps>(({ selected, className, ...props }) => (
	<VerticalIconTextButton
		className={clsx('rounded-[10px] py-2', selected && 'bg-[#b9c1f4] font-bold dark:bg-[#60557e]', className)}
		{...props}
	/>
));

GridButton.displayName = 'GridButton';
