import { AuthController, UserController } from '../../../../controllers';

export const handleUpdateProfile = (e: Event) => {
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
	if (!avatarInput?.files) return;

	formData.append('avatar', avatarInput.files[0], 'newAvatar');
};
