import {
	checkValidNewPassword,
	checkValidAvatar,
	checkValidNewProfile,
	AsyncCatch,
	WithLoader,
	isDataResponseObject
} from './utils';
import { Store } from '../store';
import { UserApi } from '../api';

const userApi = new UserApi();

class UserControllerClass {
	@WithLoader
	@AsyncCatch()
	public async updateProfileData(data: IBaseProfileData) {
		try {
			checkValidNewProfile(data);
			const userData = await userApi.changeProfile(data);

			Store.setState('user', userData);
		} catch (e) {
			throw new Error('Произошла ошибка при обновлении профиля');
		}
	}

	@WithLoader
	@AsyncCatch()
	public async changePassword(data: IPasswordBody) {
		try {
			checkValidNewPassword(data);
			await userApi.changePassword(data);
		} catch (e) {
			throw new Error(
				(e as IResponse<unknown>)?.status === 400
					? 'Ошибка: предыдуший пароль неверен'
					: 'Произошла ошибка при попытке изменить пароль'
			);
		}
	}

	@WithLoader
	@AsyncCatch()
	public async changeAvatar(data: FormData) {
		try {
			checkValidAvatar(data);

			const newAvatar = await userApi.changeAvatar(data);
			Store.setState('user.avatar', newAvatar);
		} catch (e) {
			throw new Error(
				isDataResponseObject(e)
					? 'Произошла оишбка при попытке обновить аватар'
					: 'Проверте прикреплен ли новый аватар'
			);
		}
	}

	@WithLoader
	@AsyncCatch()
	public async searchUser(data: ISearchUserBody) {
		try {
			const searchResult = await userApi.searchUser(data);

			Store.setState('chats.searchUsers', searchResult);
		} catch (e) {
			throw new Error('Произошла ошибка при попытке найти пользователя');
		}
	}
}

export const UserController = new UserControllerClass();
