import { clsx } from 'clsx';
import { memo } from 'react';
import { IconType } from '../../types';
import { Row } from '../flex/Row';
import { Icon } from '../icons/Icon';
import { BaseButton, BaseButtonProps } from './BaseButton';

export interface HorizontalIconTextButtonProps extends BaseButtonProps {
	icon: IconType;
	iconColorSuccess?: boolean;
	text: string;
}

/**
 * A memoized horizontal button component that displays an icon and text.
 *
 * @component
 * @param {HorizontalIconTextButtonProps} props - The properties for the button component.
 * @param {string} props.icon - The icon to be displayed in the button.
 * @param {string} props.text - The text to be displayed in the button.
 * @param {string} [props.className] - Additional class names to style the button.
 * @returns {JSX.Element} The rendered horizontal icon text button component.
 */
export const HorizontalIconTextButton = memo<HorizontalIconTextButtonProps>(
	({ icon, iconColorSuccess, text, className, ...props }) => (
		<BaseButton
			className={clsx('h-5 flex-row items-center justify-center gap-x-1.5 text-lineGrey', className)}
			{...props}
		>
			<Icon className={clsx(iconColorSuccess && 'text-green-400')} icon={icon} height={20} width={20} />
			<Row className="text-xs text-primaryText dark:text-primaryTextDark">{text}</Row>
		</BaseButton>
	),
);

HorizontalIconTextButton.displayName = 'HorizontalIconTextButton';
