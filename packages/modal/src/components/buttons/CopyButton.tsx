import { clsx } from 'clsx';
import { memo, useCallback, useState } from 'react';
import { Row } from '../flex/Row';
import { Icon } from '../icons/Icon';
import { BaseButton, BaseButtonProps } from './BaseButton';

export interface CopyButtonProps extends BaseButtonProps {
	text: string;
}

export const CopyButton = memo<CopyButtonProps>(({ text, className, ...props }) => {
	const [copied, setCopied] = useState(false);

	const handleCopy = useCallback(() => {
		navigator.clipboard.writeText(text);
		setCopied(true);
		setTimeout(() => {
			setCopied(false);
		}, 1500);
	}, [text]);

	return (
		<BaseButton className={clsx('flex-row items-center gap-x-1.5 py-1', className)} onClick={handleCopy} {...props}>
			<Row className="h-[20px] w-[20px]">
				<Icon
					icon={copied ? 'checkSolid' : 'copyRegular'}
					className={clsx(copied && 'text-success')}
					height={20}
					width={20}
				/>
			</Row>
			<Row className="break-all">{text}</Row>
		</BaseButton>
	);
});

CopyButton.displayName = 'CopyButton';
