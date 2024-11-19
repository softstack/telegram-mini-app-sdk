import { clsx } from 'clsx';
import { memo } from 'react';
import { BaseButton } from './buttons/BaseButton';
import { Row, RowProps } from './flex/Row';
import { Icon } from './icons/Icon';

export interface HeaderProps extends RowProps {
	title: string;
	onClose: () => void;
}

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
