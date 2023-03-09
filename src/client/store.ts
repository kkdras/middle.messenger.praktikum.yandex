import {
	Connector,
	ConfigurateStore,
	Router,
	removeItem
} from './packages';
import { deepClone } from './utils';

export const defaultStore = {
	app: {
		loader: 0,
		passwordMode: false
	},
	user: {
		id: 0,
		first_name: '',
		second_name: '',
		display_name: '' as string | null,
		login: '',
		avatar: null as string | null,
		email: '',
		phone: ''
	}
};

export const Store = new ConfigurateStore(deepClone(defaultStore));
const connector = new Connector(Store);
const router = new Router();
export type StateType = typeof defaultStore;

setTimeout(() => {
	Store.setState('user.email', 'mojolkozlov');
}, 1000);

export const errorHandler = (e: Error) => {
	if (process.env.NODE_ENV === 'production') {
		const message = e?.message || (e as unknown as IResponse<string>).json || '';
		// eslint-disable-next-line no-alert
		alert(`An error has occurred ${message}`);
		router.go('/externalError');
	}

	const { status } = e as unknown as IResponse<unknown>;
	if (status === 401) removeItem('session');

	debugger;
};

export const loaderSelector = (store: StateType) => ({ loader: store.app.loader });
export const withLoader = connector.connect(loaderSelector);

export const userDataSelector = (store: StateType) => ({ profileData: store.user });
export const withUserData = connector.connect(userDataSelector);

export const passwordModeSelector = (store: StateType) => ({
	passwordMode: store.app.passwordMode
});
export const withPasswordMode = connector.connect(passwordModeSelector);
