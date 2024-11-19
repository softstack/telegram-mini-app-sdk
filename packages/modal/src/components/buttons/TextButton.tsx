import { clsx } from 'clsx';
import { memo } from 'react';
import { BaseButton, BaseButtonProps } from './BaseButton';

export interface TextButtonProps extends BaseButtonProps {
	text: string;
}

export const TextButton = memo<TextButtonProps>(({ text, className, ...props }) => (
	<BaseButton
		className={clsx(
			'items-center justify-center rounded-lg border border-solid border-lineGrey p-4 text-primaryText dark:text-primaryTextDark',
			className,
		)}
		{...props}
	>
		{text}
	</BaseButton>
));

TextButton.displayName = 'TextButton';
