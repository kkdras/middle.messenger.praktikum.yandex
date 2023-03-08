import { setItem } from '../packages/Storage';
import { defaultStore, errorHandler, Store } from '../store';
import { AuthApi } from '../api';
import { Router } from '../packages';
import { checkValidSignUpData, checkValidSignInData } from './utils';

const authAPI = new AuthApi();
const router = new Router();

class AuthControllerClass {
	public async signUp(data: SignUp.body) {
		try {
			Store.setState('app.loader', Store.getState().app.loader + 1);
			checkValidSignUpData(data);
			const userId = await authAPI.signUp(data);

			setItem('session', String(1));
			Store.setState('app.loader', Store.getState().app.loader - 1);
			Store.setState('user.id', userId);
			router.go('/profile');
		} catch (e) {
			Store.setState('app.loader', Store.getState().app.loader - 1);
			errorHandler(e as Error);
		}
	}

	public async getProfile() {
		try {
			Store.setState('app.loader', Store.getState().app.loader + 1);
			const userData = await authAPI.getProfile();
			Store.setState('user', userData);
			Store.setState('app.loader', Store.getState().app.loader - 1);

		} catch (e) {
			Store.setState('app.loader', Store.getState().app.loader - 1);
			errorHandler(e as Error);
			router.go('/login');
		}
	}

	public async signIn(data: SignIn.body) {
		try {
			Store.setState('app.loader', Store.getState().app.loader + 1);
			checkValidSignInData(data);
			await authAPI.signIn(data);

			Store.setState('app.loader', Store.getState().app.loader - 1);
			setItem('session', String(1));

			router.go('/profile');
		} catch (e) {
			Store.setState('app.loader', Store.getState().app.loader - 1);
			errorHandler(e as Error);
			router.go('/login');
		}
	}

	public async logout() {
		try {
			Store.setState('app.loader', Store.getState().app.loader + 1);
			await authAPI.logout();

			Store.setState('user', defaultStore.user);
			Store.setState('app.loader', Store.getState().app.loader - 1);

			router.go('/login');
		} catch (e) {
			Store.setState('app.loader', Store.getState().app.loader - 1);
			errorHandler(e as Error);
		}
	}
}

export const AuthController = new AuthControllerClass();
