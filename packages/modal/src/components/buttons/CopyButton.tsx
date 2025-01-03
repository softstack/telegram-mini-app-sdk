import { clsx } from 'clsx';
import { memo, useCallback, useMemo, useState } from 'react';
import { IconType } from 'types';
import { Row } from '../flex/Row';
import { Icon } from '../icons/Icon';
import { BaseButton, BaseButtonProps } from './BaseButton';

export interface CopyButtonProps extends BaseButtonProps {
	text: string;
	value: string | undefined;
}

export const CopyButton = memo<CopyButtonProps>(({ text, value, className, ...props }) => {
	const [copied, setCopied] = useState<'success' | 'error' | undefined>(undefined);

	const handleCopy = useCallback(() => {
		try {
			if (value === undefined) {
				setCopied('error');
			} else {
				navigator.clipboard.writeText(value);
				setCopied('success');
			}
		} catch (error) {
			setCopied('error');
			throw error;
		} finally {
			setTimeout(() => {
				setCopied(undefined);
			}, 1500);
		}
	}, [value]);

	const copyIcon = useMemo<IconType>(() => {
		switch (copied) {
			case 'error':
				return 'xmarkSolid';
			case 'success':
				return 'checkSolid';
			default:
				return 'copyRegular';
		}
	}, [copied]);

	return (
		<BaseButton className={clsx('flex-row items-center gap-x-1.5 py-1', className)} onClick={handleCopy} {...props}>
			<Row className="h-[20px] w-[20px]">
				<Icon
					icon={copyIcon}
					className={clsx(copied === 'error' ? 'text-error' : copied === 'success' ? 'text-success' : undefined)}
					height={20}
					width={20}
				/>
			</Row>
			<Row className="break-all">{text}</Row>
		</BaseButton>
	);
});

CopyButton.displayName = 'CopyButton';
