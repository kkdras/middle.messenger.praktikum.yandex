import { removeItem, setItem } from '../packages/Storage';
import { defaultStore, Store } from '../store';
import { AuthApi } from '../api';
import { Router } from '../packages';
import {
	checkValidSignUpData,
	checkValidSignInData,
	WithLoader,
	AsyncCatch,
	isDataResponseObject
} from './utils';

const authAPI = new AuthApi();
const router = new Router();

class AuthControllerClass {
	@WithLoader
	@AsyncCatch()
	public async signUp(data: SignUp.body) {
		try {
			checkValidSignUpData(data);
			const userId = await authAPI.signUp(data);

			setItem('session', String(1));
			Store.setState('user.id', userId);
			router.go('/messenger');
		} catch (e) {
			throw new Error('Произошла оишбка при попытке регистрации');
		}
	}

	@WithLoader
	@AsyncCatch()
	public async getProfile() {
		try {
			const userData = await authAPI.getProfile();
			Store.setState('user', userData);
		} catch (e) {
			if (isDataResponseObject(e) && e.status === 401) {
				router.go('/login', true);
				removeItem('session');
				return;
			}
			throw new Error('Произошла ошибка при загрузке профиля');
		}
	}

	@WithLoader
	@AsyncCatch()
	public async signIn(data: SignIn.body) {
		try {
			checkValidSignInData(data);
			await authAPI.signIn(data);
			setItem('session', String(1));

			router.go('/messenger');
		} catch (e) {
			throw new Error('Произошла ошибка при попытке авторизации');
		}
	}

	@WithLoader
	@AsyncCatch()
	public async logout() {
		try {
			await authAPI.logout();
			Store.setState('user', defaultStore.user);
			removeItem('session');

			router.go('/login');
		} catch (e) {
			throw new Error('Произошла ошибка при попытке выхода из учетной записи');
		}
	}
}

export const AuthController = new AuthControllerClass();
