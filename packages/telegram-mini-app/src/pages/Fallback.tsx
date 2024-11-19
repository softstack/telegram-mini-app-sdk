import { memo } from 'react';

export const Fallback = memo(() => {
	return <div>Fallback</div>;
});

Fallback.displayName = 'Fallback';
