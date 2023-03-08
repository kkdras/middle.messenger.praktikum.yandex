/* eslint-disable max-classes-per-file */
import { deepClone, isEqual, limitDeepCopy } from '../utils';
import Block from './Block';
import Store, { StoreType } from './Store';

type InferObjectValues<T> = T extends Record<string, infer V>
	? InferObjectValues<V> | V
	: T;

type Selector<T extends Record<string, unknown>> = (
	store: T
)=> Record<string, InferObjectValues<T>>;

type ReturnConstructor<
	T extends abstract new (...args: any[])=> any, K extends (...any: any[])=> any
> = new (
	args: Omit<ConstructorParameters<T>[0], keyof ReturnType<K>>
)=> InstanceType<T>;

class Connector<S extends InstanceType<StoreType>> {
	constructor(
		readonly _store: S
	) { }

	connect<L extends Selector<S['_state']>>(selector: L) {
		const store = this._store;
		return <T extends abstract new (...args: any[])=> Block>(superClass: T) => {
			abstract class Connected extends superClass {
				constructor(...args: any[]) {
					let mappedStore = deepClone(selector(store.getState() as S['_state']), limitDeepCopy);
					super({
						...args[0],
						...mappedStore
					});

					store.on(Store.EVENTS.Updated, () => {
						const newMappedStore = selector(store.getState() as S['_state']);

						if (isEqual(mappedStore, newMappedStore)) return;
						mappedStore = newMappedStore;
						(this as unknown as Block).setProps({ ...this._meta.props, ...newMappedStore });
					});
				}
			}
			return Connected as unknown as ReturnConstructor<T, L>;
		};
	}
}

export default Connector;
