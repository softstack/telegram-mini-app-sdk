import { clsx } from 'clsx';
import { memo } from 'react';
import { IconType } from '../../types';
import { Row } from '../flex/Row';
import { Icon } from '../icons/Icon';
import { BaseButton, BaseButtonProps } from './BaseButton';

export interface HorizontalIconTextButtonProps extends BaseButtonProps {
	icon: IconType;
	text: string;
}

export const HorizontalIconTextButton = memo<HorizontalIconTextButtonProps>(({ icon, text, className, ...props }) => (
	<BaseButton
		className={clsx('h-5 flex-row items-center justify-center gap-x-1.5 text-lineGrey', className)}
		{...props}
	>
		<Icon icon={icon} height={20} width={20} />
		<Row className="text-xs text-primaryText dark:text-primaryTextDark">{text}</Row>
	</BaseButton>
));

HorizontalIconTextButton.displayName = 'HorizontalIconTextButton';
