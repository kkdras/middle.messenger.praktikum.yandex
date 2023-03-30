import { WSController } from './chatSocket';
import {
	addLoader,
	assertsAllSettledPromise,
	AsyncCatch,
	checkIsMessageType,
	SyncCatch,
	throwError,
	WithLoader
} from './utils';
import { defaultChat, Store } from '../store';
import { ChatsApi } from '../api';

const chatApi = new ChatsApi();

const handleReceiveMessage = (message: unknown) => {
	if (!checkIsMessageType(message)) return;

	const { messages } = Store.getState().chats.currentChat;

	const updatedMessages = messages.concat(
		Array.isArray(message) ? message.reverse() : [message]
	);
	Store.setState('chats.currentChat.messages', updatedMessages);
};

class ChatsControllerClass {
	ws = null as null | WSController;

	@WithLoader
	@AsyncCatch()
	public async createChat(data: ICreateChat) {
		try {
			addLoader();
			await chatApi.createChat(data);
			await this.getChats();

			Store.setState('app.showNewChatPopUp', false);
		} catch (e) {
			throw new Error('Проиошла ошибка при создании нового чата');
		}
	}

	@WithLoader
	@AsyncCatch()
	public async getChats() {
		try {
			const chats = await chatApi.getChats();
			Store.setState('chats.list', chats);
		} catch (e) {
			throw new Error('Произошла ошибка при загрузке чатов');
		}
	}

	@WithLoader
	@AsyncCatch()
	public async addUser(data: IChatUserBody) {
		try {
			await chatApi.addUser(data);
			await this.getChatUsers(data.chatId);
		} catch (e) {
			throw new Error('Произошла ошибка при добавлении пользователя в чат');
		}
	}

	@WithLoader
	@AsyncCatch()
	public async deleteUser(data: IChatUserBody) {
		try {
			await chatApi.deleteUser(data);

			const authUser = Store.getState().user.id;
			if (data.users.some((userId) => userId === authUser)) {
				this.closeChat();
				this.getChats();
				return;
			}

			await this.getChatUsers(data.chatId);
		} catch (e) {
			throw new Error('Произошла ошибка при удалении пользователя из чата');
		}
	}

	@WithLoader
	@AsyncCatch({ nextThrow: true })
	private async getChatUsers(id: number) {
		try {
			const chatUsers = await chatApi.getChatUsers(id);
			Store.setState('chats.currentChat.users', chatUsers);
		} catch (e) {
			throw new Error('Произошла ошибка при загрузке пользователей');
		}
	}

	@WithLoader
	@AsyncCatch({ nextThrow: true })
	private async createChatToken(id: number) {
		try {
			const { token } = await chatApi.createChatToken(id);

			Store.setState('chats.currentChat.token', token);
			return token;
		} catch (e) {
			throw new Error('Произошла ошибка при генерации токена');
		}
	}

	@SyncCatch()
	public closeChat() {
		Store.setState('chats.currentChat', defaultChat.currentChat);
		Store.setState('chats.showChat', false);
		this.ws?.closeConnection();
		this.ws = null;
	}

	@SyncCatch()
	public sendMessage(message: string) {
		if (this.ws) {
			this.ws.sendData({
				type: 'message',
				content: message
			});
		} else {
			throw new Error('Произошла ошибка при отправке сообщения');
		}
	}

	@WithLoader
	@AsyncCatch()
	public async startChat(chatId: number) {
		try {
			this.closeChat();

			const userId = Store.getState().user.id;
			if (userId === 0) throwError('err loading your profile');

			//! create token
			const tokenPromise = this.createChatToken(chatId);

			//! get chat users
			// if it wont possible to load users, then it'll simply
			// not be possible to remove someone from the chat, but it
			// wont interfere to work with chat :)
			const usersPromise = this.getChatUsers(chatId);

			const [tokenRes] = await Promise.allSettled([tokenPromise, usersPromise]);
			if (tokenRes.status === 'rejected') {
				assertsAllSettledPromise(tokenRes);
			}
			const token = tokenRes.value;

			this.ws = await new Promise((res, rej) => {
				const ws = new WSController(
					`wss://ya-praktikum.tech/ws/chats/${userId}/${chatId}/${token}`,
					handleReceiveMessage,
					(wsInstance) => {
						res(wsInstance);
					},
					() => rej(new Error('fail open ws connection'))
				);
				ws.openConnection();
			});
			this.ws?.sendData({
				content: '0',
				type: 'get old'
			});

			Store.setState('chats.currentChat.id', chatId);
			Store.setState('chats.showChat', true);
		} catch (e) {
			throw new Error('Произошла ошибка при загрузки чата');
		}
	}
}

export const ChatsController = new ChatsControllerClass();
