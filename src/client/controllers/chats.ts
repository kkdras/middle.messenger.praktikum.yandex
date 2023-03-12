import { logger } from '../utils/functions';
import { WSController } from './chatSocket';
/* eslint-disable implicit-arrow-linebreak */
import {
	addLoader,
	assertsAllSettledPromise,
	removeLoader,
	throwError
} from './utils';
import { errorHandler, Store } from '../store';
import { ChatsApi } from '../api';

const chatApi = new ChatsApi();

const handleReceiveMessage = (message: unknown) => {
	const newMessage = message as IMessage | IMessage[];
	const { messages } = Store.getState().chats.currentChat;
	if (!Array.isArray(message) && (newMessage as IMessage).type !== 'message') return;
	Store.setState('chats.currentChat.messages', messages.concat(
		Array.isArray(message) ? message : [message]
	));
};

class ChatsControllerClass {
	ws = null as null | WSController;
	public async createChat(data: ICreateChat) {
		try {
			addLoader();
			await chatApi.createChat(data);
			await this.getChats();

			Store.setState('app.showNewChatPopUp', false);

			removeLoader();
		} catch (e) {
			removeLoader();
			errorHandler(e as Error);
		}
	}

	public async getChats() {
		try {
			addLoader();
			const chats = await chatApi.getChats();
			Store.setState('chats.list', chats);
			removeLoader();
		} catch (e) {
			removeLoader();
			errorHandler(e as Error);
		}
	}

	public async addUser(data: IChatUserBody) {
		try {
			addLoader();
			await chatApi.addUser(data);
			await this.getChatUsers(data.chatId);

			removeLoader();
		} catch (e) {
			removeLoader();
			errorHandler(e as Error);
		}
	}

	public async deleteUser(data: IChatUserBody) {
		try {
			addLoader();
			await chatApi.deleteUser(data);
			await this.getChatUsers(data.chatId);

			const authUser = Store.getState().user.id;
			if (data.users.some((userId) => userId === authUser)) {
				this.closeChat();
				this.getChats();
			}

			removeLoader();
		} catch (e) {
			removeLoader();
			errorHandler(e as Error);
		}
	}

	public sendMessage(message: string) {
		if (this.ws) {
			this.ws.sendData({
				type: 'message',
				content: message
			});
		} else {
			logger(new Error('ws doesn\'t exist you can\'t send message'));
		}
	}

	//! it's necessary to remove loader after res or rej
	private async getChatUsers(id: number) {
		addLoader();

		const chatUsers = await chatApi.getChatUsers(id);
		Store.setState('chats.currentChat.users', chatUsers);
		removeLoader();
		return chatUsers;
	}

	//! it's necessary to remove loader after res or rej
	private async createChatToken(id: number) {
		addLoader();
		const { token } = await chatApi.createChatToken(id);

		Store.setState('chats.currentChat.token', token);
		removeLoader();
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

	public async startChat(chatId: number) {
		try {
			this.closeChat();

			const userId = Store.getState().user.id;
			if (userId === 0) throwError('err loading your profile');

			addLoader();

			//! create token
			const tokenPromise = this.createChatToken(chatId).catch(() =>
				removeLoader());

			//! get chat users
			// if it wont possible to load users, then it'll simply
			// not be possible to remove someone from the chat, but it
			// wont interfere to work with chat :)
			const usersPromise = this.getChatUsers(chatId).catch(() =>
				removeLoader());

			const [tokenRes] = await Promise.allSettled([tokenPromise, usersPromise]);
			if (tokenRes.status === 'rejected') {
				assertsAllSettledPromise(tokenRes, 'fail generating chat token');
			}
			const token = tokenRes.value;

			this.ws = await new Promise((res, rej) => {
				const ws = new WSController(
					`wss://ya-praktikum.tech/ws/chats/${userId}/${chatId}/${token}`,
					handleReceiveMessage,
					(wsInstance) => res(wsInstance),
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
			removeLoader();
		} catch (e) {
			Store.setState('chats.showChat', false);
			removeLoader();
			errorHandler(e as Error);
		}
	}
}

export const ChatsController = new ChatsControllerClass();
