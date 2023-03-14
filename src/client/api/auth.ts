import { HTTPTransport } from '../packages';

const fetcher = new HTTPTransport('/auth');

export class AuthApi {
	signUp(body: SignUp.body) {
		return fetcher.post<SignUp.success>('/signup', { data: body })
			.then(({ json: { id } }) => id);
	}

	getProfile() {
		return fetcher.get<IProfileData>('/user')
			.then(({ json }) => json);
	}

	signIn(body: SignIn.body) {
		return fetcher.post('/signin', { data: body, parseResult: false });
	}

	logout() {
		return fetcher.post('/logout', { parseResult: false });
	}
}
