import { UserController } from '../../../../controllers';
import { Store } from '../../../../store';

export const handleChangePassword = (e: Event) => {
	e.preventDefault();
	const form = e.target as HTMLFormElement;
	if (form.checkValidity()) {
		const formData = new FormData(e.target as HTMLFormElement);
		const oldPassword = formData.get('oldPassword');
		const newPassword = formData.get('newPassword');
		if (oldPassword && newPassword) {
			UserController.changePassword({
				newPassword: newPassword as string,
				oldPassword: oldPassword as string
			});
		}
	}
};

export const handleChangeProfileData = (e: Event) => {
	e.preventDefault();
	Store.setState('app.passwordMode', false);
};
