import { HTMLAttributes, memo } from 'react';
import { twMerge } from 'tailwind-merge';

export type BaseButtonProps = HTMLAttributes<HTMLButtonElement>;

export const BaseButton = memo<BaseButtonProps>(({ children, className, ...props }) => (
	<button
		className={twMerge(
			'border-box no-tap-highlight flex cursor-pointer border-none bg-transparent p-0 font-sans text-base text-inherit',
			className,
		)}
		{...props}
	>
		{children}
	</button>
));

BaseButton.displayName = 'BaseButton';
