import {
	debounceInvokeFunction, deepClone, logger, set
} from '../utils';
import { EventBus } from './Event-bus';

type StoreRestrict = Record<string, unknown>;

export class Store<T extends StoreRestrict> extends EventBus {
	readonly _state: T;
	static _initialized: boolean;

	constructor(initValues: T) {
		super();
		this._state = initValues;
		if (Store._initialized) throw new Error('store already defined');
		Store._initialized = true;
	}

	static EVENTS = {
		Updated: 'store-updated'
	};

	getState(): T {
		return this._state;
	}

	setState(path: string, value: unknown) {
		set(this._state, path, deepClone(value));
		debounceInvokeFunction(this.emit.bind(this, Store.EVENTS.Updated));
		logger(this._state);
		return this._state;
	}
}

export type StoreType = typeof Store;
