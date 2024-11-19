import { toast } from 'react-toastify';

export const handleError = (error: unknown): void => {
	if (error instanceof Error) {
		toast.error(error.message);
	} else {
		toast.error('An error occurred');
	}
	console.error(error);
};
