import { memo } from 'react';
import { Col, ColProps } from './flex/Col';
import { Row } from './flex/Row';

export interface LabelledProps extends ColProps {
	label: string;
}

export const Labelled = memo<LabelledProps>(({ children, label, ...props }) => {
	return (
		<Col {...props}>
			<Row className="text-xs">{label}</Row>
			{children}
		</Col>
	);
});

Labelled.displayName = 'Labelled';
