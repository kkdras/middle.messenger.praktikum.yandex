import { HTTPTransport } from '../packages';

const fetcher = new HTTPTransport('/auth');

export class AuthApi {
	signUp(body: SignUp.body) {
		return fetcher.post<SignUp.success>('/signup', { data: body })
			.then(({ id }) => id);
	}
}
