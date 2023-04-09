import { HTTPTransport } from '../packages/Fetch';

const fetcher = new HTTPTransport('/chats');

export class ChatsApi {
	createChat(body: ICreateChat) {
		return fetcher.post('', { data: body, parseResult: false });
	}

	getChats() {
		return fetcher.get<IChat[]>('').then(({ json }) => json);
	}

	addUser(body: IChatUserBody) {
		return fetcher.put('/users', { data: body, parseResult: false });
	}

	deleteUser(body: IChatUserBody) {
		return fetcher.delete('/users', { data: body, parseResult: false });
	}

	getChatUsers(id: number) {
		return fetcher.get<IProfileData[]>(`/${id}/users`)
			.then(({ json }) => json);
	}

	createChatToken(id: number) {
		return fetcher.post<ITokenResponse>(`/token/${id}`)
			.then(({ json }) => json);
	}
}
