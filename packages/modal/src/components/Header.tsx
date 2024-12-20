import { clsx } from 'clsx';
import { memo } from 'react';
import { BaseButton } from './buttons/BaseButton';
import { Row, RowProps } from './flex/Row';
import { Icon } from './icons/Icon';

export interface HeaderProps extends RowProps {
	title: string;
	onClose: () => void;
}

/**
 * Header component that displays a title and a close button.
 *
 * @param {HeaderProps} props - The properties for the Header component.
 * @param {string} props.title - The title to be displayed in the header.
 * @param {() => void} props.onClose - The function to be called when the close button is clicked.
 * @param {string} [props.className] - Additional class names to apply to the header.
 *
 * @returns {JSX.Element} The rendered Header component.
 */
export const Header = memo<HeaderProps>(({ title, onClose, className }) => (
	<Row
		className={clsx(
			'min-h-[3.625rem] items-center justify-between border-x-0 border-y border-t-0 border-solid border-lineGrey px-pageFrame',
			className,
		)}
	>
		<Row className="text-[1.25rem] font-bold">{title}</Row>
		<BaseButton className="size-6 items-center justify-center" onClick={onClose}>
			<Icon icon="xmarkSolid" className="text-lineGrey" height={14} width={14} />
		</BaseButton>
	</Row>
));

Header.displayName = 'Header';
