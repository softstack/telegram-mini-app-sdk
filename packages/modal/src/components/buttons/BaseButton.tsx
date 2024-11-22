import { HTMLAttributes, memo } from 'react';
import { tw } from '../../utils';

export type BaseButtonProps = HTMLAttributes<HTMLButtonElement>;

/**
 * `BaseButton` is a memoized functional component that renders a customizable button element.
 *
 * @param {BaseButtonProps} props - The properties passed to the button component.
 * @param {React.ReactNode} props.children - The content to be displayed inside the button.
 * @param {string} [props.className] - Additional class names to apply to the button.
 * @param {React.ButtonHTMLAttributes<HTMLButtonElement>} props - Additional props to be spread onto the button element.
 *
 * @returns {JSX.Element} A button element with the specified properties and children.
 */
export const BaseButton = memo<BaseButtonProps>(({ children, className, ...props }) => (
	<button
		className={tw(
			'border-box no-tap-highlight flex cursor-pointer border-none bg-transparent p-0 font-sans text-base text-inherit',
			className,
		)}
		{...props}
	>
		{children}
	</button>
));

BaseButton.displayName = 'BaseButton';
