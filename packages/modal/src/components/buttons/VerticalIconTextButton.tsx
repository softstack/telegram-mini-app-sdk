import { clsx } from 'clsx';
import { memo } from 'react';
import { IconType } from '../../types';
import { Row } from '../flex/Row';
import { Icon } from '../icons/Icon';
import { BaseButton, BaseButtonProps } from './BaseButton';

export interface VerticalIconTextButtonProps extends BaseButtonProps {
	icon: IconType;
	text: string;
}

/**
 * `VerticalIconTextButton` is a memoized component that renders a button with an icon and text arranged vertically.
 *
 * @param {VerticalIconTextButtonProps} props - The properties for the button component.
 * @param {string} props.icon - The icon to be displayed in the button.
 * @param {string} props.text - The text to be displayed below the icon in the button.
 * @param {string} [props.className] - Additional class names to apply to the button.
 * @returns {JSX.Element} The rendered button component.
 */
export const VerticalIconTextButton = memo<VerticalIconTextButtonProps>(({ icon, text, className, ...props }) => (
	<BaseButton className={clsx('flex-col items-center justify-center gap-y-1.5', className)} {...props}>
		<Icon icon={icon} className="rounded-[0.5rem] object-contain" height={48} width={48} />
		<Row className="text-xs">{text}</Row>
	</BaseButton>
));

VerticalIconTextButton.displayName = 'VerticalIconTextButton';
