import { setItem } from '../packages/Storage';
import { defaultStore, Store } from '../store';
import { AuthApi } from '../api';
import { Router } from '../packages';
import {
	checkValidSignUpData,
	checkValidSignInData,
	removeLoader,
	WithLoader,
	AsyncCatch
} from './utils';

const authAPI = new AuthApi();
const router = new Router();

class AuthControllerClass {
	@WithLoader
	@AsyncCatch()
	public async signUp(data: SignUp.body) {
		checkValidSignUpData(data);
		const userId = await authAPI.signUp(data);

		setItem('session', String(1));
		removeLoader();
		Store.setState('user.id', userId);
		router.go('/profile');
	}

	@WithLoader
	@AsyncCatch()
	public async getProfile() {
		try {
			const userData = await authAPI.getProfile();
			Store.setState('user', userData);
			removeLoader();
		} catch (e) {
			router.go('/login');
			throw e;
		}
	}

	@WithLoader
	@AsyncCatch()
	public async signIn(data: SignIn.body) {
		try {
			checkValidSignInData(data);
			await authAPI.signIn(data);

			removeLoader();
			setItem('session', String(1));

			router.go('/messenger');
		} catch (e) {
			router.go('/login');
			throw e;
		}
	}

	@WithLoader
	@AsyncCatch()
	public async logout() {
		await authAPI.logout();
		Store.setState('user', defaultStore.user);
		removeLoader();

		router.go('/login');
	}
}

export const AuthController = new AuthControllerClass();
