export interface IEventBus {
	on(name: string, callback: (...args: any[])=> void): void
	off(name: string, callback: (...args: any[])=> void): void
	emit(name: string, ...args: any[]): void
}

class EventBus implements IEventBus {
	listeners: Record<string, any[]>;
	constructor() {
		this.listeners = {};
	}

	on(event: string, callback: (...args: any[])=> void): void {
		if (!this.listeners[event]) this.listeners[event] = [];

		this.listeners[event].push(callback);
	}
	off(event: string, callback: (...args: any[])=> void): void {
		if (!this.listeners[event]) {
			console.warn(`Нет события: ${event}`);
			return;
		}

		this.listeners[event] = this.listeners[event].filter(
			(listener) => listener !== callback
		);
	}
	emit(event: string, ...args: any[]): void {
		if (!this.listeners[event]) {
			console.warn(`Нет события: ${event}`);
			return;
		}

		this.listeners[event].forEach((listener) => {
			listener(...args);
		});
	}
}

export default EventBus;
