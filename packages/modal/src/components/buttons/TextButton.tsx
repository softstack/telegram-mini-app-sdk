import { clsx } from 'clsx';
import { memo } from 'react';
import { BaseButton, BaseButtonProps } from './BaseButton';

export interface TextButtonProps extends BaseButtonProps {
	text: string;
}

/**
 * A memoized text button component that renders a button with customizable text and class names.
 * It uses the `BaseButton` component and applies additional styles and properties.
 *
 * @param {TextButtonProps} props - The properties for the TextButton component.
 * @param {string} props.text - The text to be displayed inside the button.
 * @param {string} [props.className] - Additional class names to apply to the button.
 * @returns {JSX.Element} The rendered TextButton component.
 */
export const TextButton = memo<TextButtonProps>(({ text, className, ...props }) => (
	<BaseButton
		className={clsx(
			'items-center justify-center rounded-lg border border-solid border-line p-4 text-primaryText dark:text-primaryTextDark',
			className,
		)}
		{...props}
	>
		{text}
	</BaseButton>
));

TextButton.displayName = 'TextButton';
