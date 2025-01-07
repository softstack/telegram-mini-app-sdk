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

/**
 * Accordion component that displays a collapsible section with a title.
 *
 * @param {AccordionProps} props - The properties for the Accordion component.
 * @param {string} props.title - The title of the accordion.
 * @param {boolean} [props.open] - Whether the accordion is initially open.
 * @param {function} [props.onChangeOpen] - Callback function to handle the change in open state.
 * @param {string} [props.className] - Additional class names for the accordion.
 * @param {React.ReactNode} props.children - The content to be displayed inside the accordion.
 * @param {object} [props] - Additional properties to be passed to the accordion.
 *
 * @returns {JSX.Element} The rendered Accordion component.
 */
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
					className="size-6 items-center justify-center rounded-full border border-solid border-line bg-light dark:border-lineDark dark:bg-dark"
					onClick={toggleOpen}
				>
					<Icon
						icon={(open ?? internalOpen) ? 'chevronUpSolid' : 'chevronDownSolid'}
						className="text-icon dark:text-iconDark"
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
