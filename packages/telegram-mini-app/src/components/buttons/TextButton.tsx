import { clsx } from 'clsx';
import { memo } from 'react';
import { BaseButton, BaseButtonProps } from 'telegram-mini-app/src/components/buttons/BaseButton';

export interface TextButtonProps extends BaseButtonProps {
	text: string;
}

export const TextButton = memo<TextButtonProps>(({ text, className, ...props }) => {
	return (
		<BaseButton className={clsx('justify-center bg-blue-400 py-2 text-white', className)} {...props}>
			{text}
		</BaseButton>
	);
});

TextButton.displayName = 'TextButton';
