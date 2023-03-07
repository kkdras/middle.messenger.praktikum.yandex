import { Connector, ConfigurateStore } from './packages';

const defaultStore = {
	app: {
		loader: 0
	},
	user: {
		id: 0
	}
};

export const Store = new ConfigurateStore(defaultStore);
export const connect = new Connector(Store);

export const errorHandler = (e: Error) => {
	console.error(e);
	if (process.env.NODE_ENV === 'production') {
		alert('An error has occurred');
	}
	debugger;
};
