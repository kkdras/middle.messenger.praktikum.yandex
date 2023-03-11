// import { Store, errorHandler as baseErrorHandler } from '../store';

// messages_1.html
/*
const  socket = new WebSocket(
	'wss://ya-praktikum.tech/ws/chats/1/1/fd23a974ce050d56d969b3c4ca1b2cc951ef4110:1600530634'
);

socket.addEventListener('open', () => {
	console.log('Соединение установлено');

	socket.send(
		JSON.stringify({
			content: 'Моё первое сообщение миру!',
			type: 'message'
		})
	);
});

socket.addEventListener('close', (event) => {
	if (event.wasClean) {
		console.log('Соединение закрыто чисто');
	} else {
		console.log('Обрыв соединения');
	}

	console.log(`Код: ${event.code} | Причина: ${event.reason}`);
});

socket.addEventListener('message', (event) => {
	console.log('Получены данные', event.data);
});

socket.addEventListener('error', (event) => {
	console.log('Ошибка', event.message);
}); */

type ListenerItem = {
	type: string;
	handler: (...args: any[])=> void;
};

export class WSController {
	private ws = null as null | WebSocket;
	private listeners = [] as ListenerItem[];

	constructor(
		private url: string,
		private tryCount: number = 5
	) {}

	public openConnection() {
		if (this.ws) {
			console.warn('connection already exist');
			return;
		}

		this.ws = new WebSocket(this.url);
	}

	public closeConnection() {
		this.cleanUp();
	}

	private cleanUp = () => {
		const { ws } = this;
		if (ws === null) return;

		this.listeners.forEach(({ type, handler }) =>
			ws.removeEventListener(type, handler));
		this.listeners = [];
		ws.close();
		this.ws = null;
	};

	private observeWs() {
		const handleClose = (event: CloseEvent) => {
			console.log('ws connection is lost');
			this.cleanUp();

			if (event.wasClean) return;
			if (this.tryCount-- > 0) {
				this.openConnection();
				this.observeWs();
			}
		};
		this.ws?.addEventListener('close', handleClose);
		this.listeners.push({ type: 'close', handler: handleClose });

		const handleMessage = (e: MessageEvent<any>) => {
			console.log('message received', e.data);
		};
		this.ws?.addEventListener('message', handleMessage);
		this.listeners.push({ type: 'message', handler: handleMessage });

		const handleOpen = () => {
			console.log('ws connection was opened');
		};
		this.ws?.addEventListener('open', handleOpen);
		this.listeners.push({ type: 'open', handler: handleOpen });
	}
}

// const eventData = event.data as IDraftMessage[];

// const users = Store.getState().chats.currentChatUsers;
// const prevMessages = Store.getState().chats.currentChatMessages;

// const transformedMessages = eventData.map((message): IMessage => {
// 	const userName: string = users
// 		.find((user) => String(user.id) === message.user_id)?.display_name || 'аноним';

// 	const draftTime = new Date(message.time);

// 	return {
// 		content: message.content,
// 		time: `${draftTime.getHours()} ${draftTime.getMinutes()}`,
// 		displayName: userName
// 	};
// });

// console.log(transformedMessages);
// Store.setState('chats.currentChatMessages', prevMessages.concat(transformedMessages));
