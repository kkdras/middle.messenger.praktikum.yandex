import {
	checkValidNewPassword, checkValidAvatar, checkValidNewProfile, removeLoader, addLoader
} from './utils';
import { errorHandler, Store } from '../store';
import { UserApi } from '../api';

const userApi = new UserApi();

class UserControllerClass {
	public async updateProfileData(data: IBaseProfileData) {
		try {
			addLoader();
			checkValidNewProfile(data);
			const userData = await userApi.changeProfile(data);

			Store.setState('user', userData);
			removeLoader();

		} catch (e) {
			removeLoader();
			errorHandler(e as Error);
		}
	}

	public async changePassword(data: IPasswordBody) {
		try {
			addLoader();
			checkValidNewPassword(data);
			await userApi.changePassword(data);

			removeLoader();

		} catch (e) {
			removeLoader();
			errorHandler(e as Error);
		}
	}

	public async changeAvatar(data: FormData) {
		try {
			addLoader();
			checkValidAvatar(data);

			const newAvatar = await userApi.changeAvatar(data);

			Store.setState('user.avatar', newAvatar);

			removeLoader();
		} catch (e) {
			removeLoader();
			errorHandler(e as Error);
		}
	}

	public async searchUser(data: ISearchUserBody) {
		try {
			addLoader();

			const searchResult = await userApi.searchUser(data);

			Store.setState('chats.searchUsers', searchResult);

			removeLoader();
		} catch (e) {
			removeLoader();
			errorHandler(e as Error);
		}
	}
}

export const UserController = new UserControllerClass();
