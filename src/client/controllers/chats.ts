import { WSController } from './chatSocket';
import {
	addLoader,
	assertsAllSettledPromise,
	AsyncCatch,
	throwError,
	WithLoader
} from './utils';
import { Store } from '../store';
import { ChatsApi } from '../api';

const chatApi = new ChatsApi();

const handleReceiveMessage = (message: unknown) => {
	const newMessage = message as IMessage | IMessage[];
	const { messages } = Store.getState().chats.currentChat;
	if (!Array.isArray(message) && (newMessage as IMessage).type !== 'message') return;
	Store.setState('chats.currentChat.messages', messages.concat(
		Array.isArray(message) ? message.reverse() : [message]
	));
};

class ChatsControllerClass {
	ws = null as null | WSController;

	@WithLoader
	@AsyncCatch()
	public async createChat(data: ICreateChat) {
		addLoader();
		await chatApi.createChat(data);
		await this.getChats();

		Store.setState('app.showNewChatPopUp', false);
	}

	@WithLoader
	@AsyncCatch()
	public async getChats() {
		const chats = await chatApi.getChats();
		Store.setState('chats.list', chats);
	}

	@WithLoader
	@AsyncCatch()
	public async addUser(data: IChatUserBody) {
		await chatApi.addUser(data);
		await this.getChatUsers(data.chatId);
	}

	@WithLoader
	@AsyncCatch()
	public async deleteUser(data: IChatUserBody) {
		await chatApi.deleteUser(data);

		const authUser = Store.getState().user.id;
		if (data.users.some((userId) => userId === authUser)) {
			this.closeChat();
			this.getChats();
			return;
		}

		await this.getChatUsers(data.chatId);
	}

	@WithLoader
	@AsyncCatch({ nextThrow: true })
	private async getChatUsers(id: number) {
		const chatUsers = await chatApi.getChatUsers(id);
		Store.setState('chats.currentChat.users', chatUsers);
		return chatUsers;
	}

	//! it's necessary to remove loader after res or rej
	@WithLoader
	@AsyncCatch({ nextThrow: true })
	private async createChatToken(id: number) {
		const { token } = await chatApi.createChatToken(id);

		Store.setState('chats.currentChat.token', token);
		return token;
	}

	public closeChat() {
		Store.setState('chats.currentChat.id', 0);
		Store.setState('chats.currentChat.users', []);
		Store.setState('chats.currentChat.token', '');
		Store.setState('chats.currentChat.messages', []);
		Store.setState('chats.showChat', false);
		this.ws?.closeConnection();
		this.ws = null;
	}

	public sendMessage(message: string) {
		if (this.ws) {
			this.ws.sendData({
				type: 'message',
				content: message
			});
		} else {
			throw new Error('ws doesn\'t exist you can\'t send message');
		}
	}

	@WithLoader
	@AsyncCatch()
	public async startChat(chatId: number) {
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
			assertsAllSettledPromise(tokenRes, 'fail generating chat token');
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
	}
}

export const ChatsController = new ChatsControllerClass();
