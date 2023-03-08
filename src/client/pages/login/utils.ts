import { AuthController } from '../../controllers';
import { Router } from '../../packages';

const router = new Router();

export const handleAccDoesExist = (e: Event) => {
	e.preventDefault();
	router.go('/registration');
};

export const handleSignIn = (e: Event) => {
	e.preventDefault();

	const form = (e.target as HTMLFormElement);
	const isValid = form.checkValidity();
	if (isValid) {
		const authData = Object.fromEntries(
			new FormData(e.target as HTMLFormElement)
		) as SignIn.body;

		AuthController.signIn(authData);
		form.reset();
	}
};
