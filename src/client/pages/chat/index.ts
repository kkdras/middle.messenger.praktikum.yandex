import tmp from 'bundle-text:./index.hbs';
import { debounceInvokeFunction } from '../../utils/functions';
import * as style from './style.module.scss';
import { Block, RouterLink } from '../../packages';
import { Button, Loader, TextField } from '../../ui';
import {
	handleCreateNewChat,
	handleLoadChat,
	transformChatProps
} from './utils';
import { withChatPageData } from '../../store';
import { newChatPopUp, InfoBanner } from './components';
import { AuthController, ChatsController } from '../../controllers';
import { ChatData } from './components/chatData';

type PropsType = {
	submitButton: Block;
	input: Block;
	showNewChatPopUp: boolean;
	chats: IChat[];
	showChat: boolean;
	loader: Block;
};

class ChatPage extends Block {
	newChatPopUp: Block;
	listChats: Block[];
	chatData: Block | null;
	constructor(props: PropsType) {
		const link = new RouterLink({
			children: 'Профиль >',
			href: '/profile',
			classes: [style.link]
		});

		const buttonNewChat = new Button({
			children: 'Создать новый чат',
			classes: [style.button],
			events: {
				click: handleCreateNewChat
			}
		});

		const popUpNewChat = newChatPopUp();

		const listChats = props.chats.map(
			(item) =>
				new InfoBanner({
					...transformChatProps(item),
					events: {
						click: handleLoadChat.bind(null, item.id)
					}
				})
		);

		const chatData = props.showChat
			? new ChatData({})
			: 'Выберете чат чтобы начать диалог';

		super('div', {
			class: {
				chat: style.chat,
				chats: style.chat__chats,
				chatActions: style.chat__actions,
				chatProfileLink: style.chat__profileLink,
				chatSearch: style.chat__search,
				chatDialog: style.chat__dialog,
				fileInput: style.chat__fileInput,
				chatsList: style.chat__chatsList
			},
			link,
			buttonNewChat,
			newChatPopUp: props.showNewChatPopUp ? popUpNewChat : null,
			listChats,
			chatData,
			...props
		});
		this.newChatPopUp = popUpNewChat;
		this.listChats = listChats;
		this.chatData = typeof chatData === 'string' ? null : chatData;
	}

	override storePropsUpdated() {
		let newProps = this._meta.props as {
			newChatPopUp: Block | null;
			listChats: Block[];
			chatData: Block | string;
		} & PropsType;
		if (!newProps.newChatPopUp && newProps.showNewChatPopUp === true) {
			newProps = { ...newProps, newChatPopUp: this.newChatPopUp };
			debounceInvokeFunction(this.dispatchComponentDidMount.bind(this, false));
		} else if (newProps.newChatPopUp && newProps.showNewChatPopUp === false) {
			newProps = { ...newProps, newChatPopUp: null };
		}

		// render updated chats
		const newListChats = newProps.chats.map(
			(item) =>
				new InfoBanner({
					...transformChatProps(item),
					events: {
						click: handleLoadChat.bind(null, item.id)
					}
				})
		);
		this.listChats.forEach((item) => item.dispatchComponentWillUnmount());
		newProps = { ...newProps, listChats: newListChats };

		const { showChat } = newProps;
		if (showChat && this.chatData === null) {
			this.chatData = new ChatData({});
		}

		newProps = {
			...newProps,
			chatData: showChat
				? (this.chatData as Block)
				: 'Выберете чат чтобы начать диалог'
		};

		this.setProps(newProps);
	}

	override componentDidMount(): void {
		AuthController.getProfile();
		ChatsController.getChats();
	}

	override componentWillUnmount(): void {
		// it doesn't break else chat wasn't open
		ChatsController.closeChat();
	}

	render() {
		return Block.compile(tmp, this.props);
	}
}

const submitButton = new Button({
	children: 'Отправить',
	type: 'submit'
});

const input = new TextField({
	id: 'message',
	label: '',
	error: false,
	maxLength: 255,
	required: true,
	placeholder: 'Введите сообщение'
});

const ConnectedChatPage = withChatPageData(ChatPage);

export default () =>
	new ConnectedChatPage({
		submitButton,
		input,
		loader: new Loader({})
	});
