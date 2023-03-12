import { logger } from '../utils';

type ListenerItem = {
	type: string;
	handler: (...args: any[])=> void;
};

export class WSController {
	private ws = null as null | WebSocket;
	private listeners = [] as ListenerItem[];

	constructor(
		private url: string,
		private handleMessage: (e: MessageEvent<any>)=> void,
		private handleOpen: (ws: WSController)=> void,
		private handleError: ()=> void,
		private tryCount: number = 5
	) {}

	public openConnection() {
		if (this.ws) {
			logger(new Error('connection already exist'));
			return;
		}

		this.ws = new WebSocket(this.url);
		this.observeWs();
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
			logger('ws connection is lost');
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
			const data = JSON.parse(e.data);
			logger('Получено сообщение', data);
			this.handleMessage(data);
		};
		this.ws?.addEventListener('message', handleMessage);
		this.listeners.push(
			{ type: 'message', handler: handleMessage }
		);

		const handleOpen = () => {
			logger('ws connection was opened');
			this.handleOpen(this);
		};
		this.ws?.addEventListener('open', handleOpen);
		this.listeners.push({ type: 'open', handler: handleOpen });

		const handleError = () => {
			logger('fail open ws connection');
			this.handleError();
		};
		this.ws?.addEventListener('error', handleError);
		this.listeners.push({ type: 'error', handler: handleError });
	}

	/**
	 * sendData
	 */
	public sendData(data: Record<string, unknown>) {
		if (this.ws) {
			this.ws.send(JSON.stringify(data));
		} else {
			logger(new Error('ws doesn\'t exist you can\'t send message'));
		}
	}
}
