import { checkValidNewPassword, checkValidAvatar, checkValidNewProfile } from './utils';
import { errorHandler, Store } from '../store';
import { UserApi } from '../api';
import { Router } from '../packages';

const userApi = new UserApi();
const router = new Router();

class UserControllerClass {
	public async updateProfileData(data: IBaseProfileData) {
		try {
			Store.setState('app.loader', Store.getState().app.loader + 1);
			checkValidNewProfile(data);
			const userData = await userApi.changeProfile(data);

			Store.setState('user', userData);
			Store.setState('app.loader', Store.getState().app.loader - 1);

		} catch (e) {
			errorHandler(e as Error);
			router.go('/login');
		}
	}

	public async changePassword(data: IPasswordBody) {
		try {
			Store.setState('app.loader', Store.getState().app.loader + 1);
			checkValidNewPassword(data);
			await userApi.changePassword(data);

			Store.setState('app.loader', Store.getState().app.loader - 1);

		} catch (e) {
			errorHandler(e as Error);
			router.go('/login');
		}
	}

	public async changeAvatar(data: FormData) {
		try {
			Store.setState('app.loader', Store.getState().app.loader + 1);
			checkValidAvatar(data);
			const newAvatar = await userApi.changeAvatar(data);

			Store.setState('user.avatar', newAvatar);
			Store.setState('app.loader', Store.getState().app.loader - 1);

		} catch (e) {
			errorHandler(e as Error);
			router.go('/login');
		}
	}
}

export const UserController = new UserControllerClass();
