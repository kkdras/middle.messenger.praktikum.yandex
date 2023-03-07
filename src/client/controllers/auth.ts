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
	public async SignUp(data: SignUp.body) {
		try {
			checkValidSignUpData(data);
			const userId = await authAPI.signUp(data);
			debugger;

			Store.setState('user.id', userId);
			router.go('/profile');
		} catch (e) {
			errorHandler(e as Error);
		}
	}
}

export const AuthController = new AuthControllerClass();
