import { Connector, ConfigureStore, removeItem } from './packages';
import { deepClone } from './utils';

export const defaultStore = {
	app: {
		loader: 0,
		passwordMode: false,
		showNewChatPopUp: false,
		showAddUserPopUp: false
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
	},
	chats: {
		list: [] as IChat[],
		showChat: false,
		currentChat: {
			id: 0,
			users: [] as IProfileData[],
			token: '',
			messages: [] as IMessage[]
		},
		searchUsers: [] as IProfileData[]
	}
};

export const Store = new ConfigureStore(deepClone(defaultStore));
const connector = new Connector(Store);
export type StateType = typeof defaultStore;

export const errorHandler = (e: Error) => {
	if (process.env.NODE_ENV === 'production') {
		const message =
			e?.message || (e as unknown as IResponse<string>).json || '';
		// eslint-disable-next-line no-alert
		alert(`An error has occurred ${message}`);
	} else {
		console.error(e);
	}

	const { status } = e as unknown as IResponse<unknown>;
	if (status === 401) removeItem('session');
};

export const loaderSelector = (store: StateType) => ({
	loader: store.app.loader
});
export const withLoader = connector.connect(loaderSelector);

export const userDataSelector = (store: StateType) => ({
	profileData: store.user
});
export const withUserData = connector.connect(userDataSelector);

export const passwordModeSelector = (store: StateType) => ({
	passwordMode: store.app.passwordMode
});
export const withPasswordMode = connector.connect(passwordModeSelector);

export const newChatPopUpSelector = (store: StateType) => ({
	showNewChatPopUp: store.app.showNewChatPopUp
});
export const withShowNewChatPopUp = connector.connect(newChatPopUpSelector);

export const chatPageSelector = (store: StateType) => ({
	showNewChatPopUp: store.app.showNewChatPopUp,
	chats: store.chats.list,
	showChat: store.chats.showChat
});
export const withChatPageData = connector.connect(chatPageSelector);

export const chatUsersSelector = (store: StateType) => ({
	chatUsers: store.chats.currentChat.users
});
export const withChatUsers = connector.connect(chatUsersSelector);

export const chatUsersAndChatIdSelector = (store: StateType) => ({
	chatUsers: store.chats.currentChat.users,
	chatId: store.chats.currentChat.id
});
export const withChatUsersAndChatId = connector.connect(
	chatUsersAndChatIdSelector
);
