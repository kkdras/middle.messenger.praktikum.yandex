import { Connector, ConfigurateStore, Router } from './packages';

const defaultStore = {
	app: {
		loader: 0
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

export const Store = new ConfigurateStore(defaultStore);
const connector = new Connector(Store);
const router = new Router();
export type StateType = typeof defaultStore;

setTimeout(() => {
	Store.setState('user.email', 'mojolkozlov');
}, 1000);

export const errorHandler = (e: Error) => {
	console.error(e);
	if (process.env.NODE_ENV === 'production') {
		alert('An error has occurred');
		router.go('/externalError');
	}
	debugger;
};

export const loaderSelector = (store: StateType) => ({ loader: store.app.loader });
export const withLoader = connector.connect(loaderSelector);

export const userDataSelector = (store: StateType) => ({ profileData: store.user });
export const withUserData = connector.connect(userDataSelector);
