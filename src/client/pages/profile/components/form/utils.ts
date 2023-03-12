import { AuthController, UserController } from '../../../../controllers';
import { Store } from '../../../../store';

export const handleUpdateProfile = (e: Event) => {
	// eslint-disable-next-line prefer-destructuring
	const passwordMode = Store.getState().app.passwordMode;
	if (passwordMode) {
		Store.setState('app.passwordMode', false);
		return;
	}

	e.preventDefault();
	const form = (e.target as HTMLFormElement);
	const isValid = form.checkValidity();
	if (isValid) {
		const newProfileData = Object.fromEntries(
			new FormData(e.target as HTMLFormElement)
		) as IBaseProfileData;

		UserController.updateProfileData(newProfileData);

		form.reset();
	}
};

export const handleLogout = (e: Event) => {
	e.preventDefault();
	AuthController.logout();
};

export const handleChangeAvatar = (e: Event) => {
	e.preventDefault();

	const formData = new FormData();
	const avatarInput = document.querySelector('input[name="avatar"]') as HTMLInputElement;
	const image = avatarInput?.files?.item(0);

	if (!image) return;

	formData.append('avatar', image);
	UserController.changeAvatar(formData);
};

export const handleChangePassword = (e: Event) => {
	e.preventDefault();
	// eslint-disable-next-line prefer-destructuring
	const passwordMode = Store.getState().app.passwordMode;
	if (!passwordMode) Store.setState('app.passwordMode', true);
};
