import { checkValidNewPassword, checkValidAvatar, checkValidNewProfile } from './utils';
import { errorHandler, Store } from '../store';
import { UserApi } from '../api';

const userApi = new UserApi();

class UserControllerClass {
	public async updateProfileData(data: IBaseProfileData) {
		try {
			Store.setState('app.loader', Store.getState().app.loader + 1);
			checkValidNewProfile(data);
			const userData = await userApi.changeProfile(data);

			Store.setState('user', userData);
			Store.setState('app.loader', Store.getState().app.loader - 1);

		} catch (e) {
			Store.setState('app.loader', Store.getState().app.loader - 1);
			errorHandler(e as Error);
		}
	}

	public async changePassword(data: IPasswordBody) {
		try {
			Store.setState('app.loader', Store.getState().app.loader + 1);
			checkValidNewPassword(data);
			await userApi.changePassword(data);

			Store.setState('app.loader', Store.getState().app.loader - 1);

		} catch (e) {
			Store.setState('app.loader', Store.getState().app.loader - 1);
			errorHandler(e as Error);
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
			Store.setState('app.loader', Store.getState().app.loader - 1);
			errorHandler(e as Error);
		}
	}

	public async searchUser(data: ISearchUserBody) {
		try {
			Store.setState('app.loader', Store.getState().app.loader + 1);

			const searchResult = await userApi.searchUser(data);

			Store.setState('usersSearch', searchResult);

			Store.setState('app.loader', Store.getState().app.loader - 1);
		} catch (e) {
			Store.setState('app.loader', Store.getState().app.loader - 1);
			errorHandler(e as Error);
		}
	}
}

export const UserController = new UserControllerClass();
