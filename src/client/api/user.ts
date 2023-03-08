import { HTTPTransport } from '../packages';

const fetcher = new HTTPTransport('/user');

export class UserApi {
	changeProfile(body: IBaseProfileData) {
		return fetcher.put<IProfileData>('/profile', { data: body })
			.then(({ json }) => json);
	}
	changeAvatar(body: FormData) {
		return fetcher.put<IProfileData>('/profile/avatar', { data: body })
			.then(({ json: { avatar } }) => avatar);
	}
	changePassword(body: IPasswordBody) {
		return fetcher.get<IProfileData>('/password', { data: body });
	}
}
