import { clsx } from 'clsx';
import { memo, useCallback, useState } from 'react';
import { BaseButton } from './buttons/BaseButton';
import { Col, ColProps } from './flex/Col';
import { Row } from './flex/Row';
import { Grid } from './Grid';
import { Icon } from './icons/Icon';

export interface AccordionProps extends ColProps {
	title: string;
	open: boolean;
	onChangeOpen: (open: boolean) => void;
}

export const Accordion = memo<AccordionProps>(({ title, open, onChangeOpen, className, children, ...props }) => {
	const [internalOpen, setInternalOpen] = useState(open ?? false);

	const toggleOpen = useCallback(() => {
		const newOpen = !(open ?? internalOpen);
		setInternalOpen(newOpen);
		onChangeOpen?.(newOpen);
	}, [open, internalOpen, onChangeOpen]);

	return (
		<Col className={clsx('gap-y-4', className)} {...props}>
			<Row className="justify-between">
				<Row>{title}</Row>
				<BaseButton
					className="size-6 items-center justify-center rounded-full border border-solid border-lineGrey bg-white dark:border-white dark:bg-dark"
					onClick={toggleOpen}
				>
					<Icon
						icon={(open ?? internalOpen) ? 'chevronUpSolid' : 'chevronDownSolid'}
						className="text-lineGrey dark:text-white"
						height={12}
						width={12}
					/>
				</BaseButton>
			</Row>
			<Grid
				className={clsx(
					'auto-rows-auto grid-cols-[repeat(auto-fill,minmax(4.313rem,1fr))] gap-1',
					!(open ?? internalOpen) && 'hidden',
				)}
			>
				{children}
			</Grid>
		</Col>
	);
});

Accordion.displayName = 'Accordion';
