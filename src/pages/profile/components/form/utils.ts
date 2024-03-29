import { AuthController, UserController } from '../../../../controllers';
import { Store } from '../../../../store';

export const handleUpdateProfile = (e: Event) => {
	const passwordMode = Store.getState().app.passwordMode;
	if (passwordMode) {
		Store.setState('app.passwordMode', false);
		return;
	}

	e.preventDefault();
	const form = (e.target as HTMLFormElement);
	const isValid = form.checkValidity();
	if (isValid) {
		const { avatar, phone, ...rest } = Object.fromEntries(
			new FormData(e.target as HTMLFormElement)
		) as IBaseProfileData;

		UserController.updateProfileData({
			...rest,
			phone: phone.replace('+', '')
		});

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
	const image = avatarInput?.files?.item(0) || '';

	formData.append('avatar', image);
	UserController.changeAvatar(formData);
};

export const handleChangePassword = (e: Event) => {
	e.preventDefault();
	const passwordMode = Store.getState().app.passwordMode;
	if (!passwordMode) Store.setState('app.passwordMode', true);
};
