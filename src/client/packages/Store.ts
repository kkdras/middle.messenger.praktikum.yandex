import { debounceInvokeFunction, set } from '../utils';
import EventBus from './Event-bus';

type StoreRestrict = Record<string, unknown>;

class Store<T extends StoreRestrict> extends EventBus {
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
		set(this._state, path, value);
		debounceInvokeFunction(this.emit.bind(this, Store.EVENTS.Updated));
		if (process.env.NODE_ENV === 'development') console.log(this._state);
		return this._state;
	}
}

export default Store;
export type StoreType = typeof Store;
