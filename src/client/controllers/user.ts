import {
	checkValidNewPassword,
	checkValidAvatar,
	checkValidNewProfile,
	AsyncCatch,
	WithLoader
} from './utils';
import { Store } from '../store';
import { UserApi } from '../api';

const userApi = new UserApi();

class UserControllerClass {
	@WithLoader
	@AsyncCatch()
	public async updateProfileData(data: IBaseProfileData) {
		checkValidNewProfile(data);
		const userData = await userApi.changeProfile(data);

		Store.setState('user', userData);
	}

	@WithLoader
	@AsyncCatch()
	public async changePassword(data: IPasswordBody) {
		checkValidNewPassword(data);
		await userApi.changePassword(data);
	}

	@WithLoader
	@AsyncCatch()
	public async changeAvatar(data: FormData) {
		checkValidAvatar(data);

		const newAvatar = await userApi.changeAvatar(data);
		Store.setState('user.avatar', newAvatar);
	}

	@WithLoader
	@AsyncCatch()
	public async searchUser(data: ISearchUserBody) {
		const searchResult = await userApi.searchUser(data);

		Store.setState('chats.searchUsers', searchResult);
	}
}

export const UserController = new UserControllerClass();
