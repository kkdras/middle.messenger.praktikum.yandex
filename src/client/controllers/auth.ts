import { errorHandler, Store } from '../store';
import { AuthApi } from '../api';
import { Router } from '../packages';

const authAPI = new AuthApi();
const router = new Router();

const checkValidSignUpData = (data: object) => {
	const valid = (
		'first_name' in data
		&& 'second_name' in data
		&& 'email' in data
		&& 'phone' in data
		&& 'password' in data
		&& 'login' in data
	);

	if (!valid) throw new Error('validation error');
};

class AuthControllerClass {
	public async signUp(data: SignUp.body) {
		try {
			checkValidSignUpData(data);
			const userId = await authAPI.signUp(data);

			Store.setState('user.id', userId);
			router.go('/profile');
		} catch (e) {
			errorHandler(e as Error);
		}
	}

	public async LoadProfile() {
		try {
			Store.setState('app.loader', Store.getState().app.loader + 1);
			const userData = await authAPI.getProfileData();

			Store.setState('user', userData);
			Store.setState('app.loader', Store.getState().app.loader - 1);

		} catch (e) {
			errorHandler(e as Error);
			router.go('/login');
		}
	}

}

export const AuthController = new AuthControllerClass();
