import { setItem } from '../packages/Storage';
import { defaultStore, errorHandler, Store } from '../store';
import { AuthApi } from '../api';
import { Router } from '../packages';
import {
	checkValidSignUpData, checkValidSignInData, addLoader, removeLoader
} from './utils';

const authAPI = new AuthApi();
const router = new Router();

class AuthControllerClass {
	public async signUp(data: SignUp.body) {
		try {
			addLoader();
			checkValidSignUpData(data);
			const userId = await authAPI.signUp(data);

			setItem('session', String(1));
			removeLoader();
			Store.setState('user.id', userId);
			router.go('/profile');
		} catch (e) {
			removeLoader();
			errorHandler(e as Error);
		}
	}

	public async getProfile() {
		try {
			addLoader();
			const userData = await authAPI.getProfile();
			Store.setState('user', userData);
			removeLoader();

		} catch (e) {
			removeLoader();
			errorHandler(e as Error);
			router.go('/login');
		}
	}

	public async signIn(data: SignIn.body) {
		try {
			addLoader();
			checkValidSignInData(data);
			await authAPI.signIn(data);

			removeLoader();
			setItem('session', String(1));

			router.go('/messenger');
		} catch (e) {
			removeLoader();
			errorHandler(e as Error);
			router.go('/login');
		}
	}

	public async logout() {
		try {
			addLoader();
			await authAPI.logout();

			Store.setState('user', defaultStore.user);
			removeLoader();

			router.go('/login');
		} catch (e) {
			removeLoader();
			errorHandler(e as Error);
		}
	}
}

export const AuthController = new AuthControllerClass();
