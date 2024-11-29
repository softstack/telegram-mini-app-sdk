import { clsx } from 'clsx';
import { memo, useCallback, useState } from 'react';
import { BaseButton } from './buttons/BaseButton';
import { Col } from './flex/Col';
import { Row } from './flex/Row';
import { Icon } from './icons/Icon';

export interface EtherlinkFieldProps {
	label: string;
	value: string;
}

export const EtherlinkField = memo<EtherlinkFieldProps>(({ label, value }) => {
	const [copied, setCopied] = useState(false);

	const handleCopy = useCallback(() => {
		navigator.clipboard.writeText(value);
		setCopied(true);
		setTimeout(() => {
			setCopied(false);
		}, 1500);
	}, [value]);

	return (
		<Col className="">
			<Row className="text-sm">{label}</Row>
			<BaseButton className="flex-row items-center gap-x-1.5 py-1" onClick={handleCopy}>
				<Icon
					icon={copied ? 'checkSolid' : 'copyRegular'}
					className={clsx(copied && 'text-success')}
					height={20}
					width={20}
				/>
				<Row className="break-all">{value}</Row>
			</BaseButton>
		</Col>
	);
});

EtherlinkField.displayName = 'EtherlinkField';
