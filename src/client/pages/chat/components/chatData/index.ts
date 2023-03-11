import tmp from 'bundle-text:./index.hbs';
import { Store, withChatUsersAndChatId } from '../../../../store';
import { Block } from '../../../../packages';
import * as styles from './style.module.scss';
import { Button } from '../../../../ui';
import { createBanner } from './utils';

type PropsType = {
	chatUsers: IProfileData[];
	chatId: number;
};

class _ChatData extends Block {
	newButton: Block;
	usersList: Block[];
	constructor(props: PropsType) {
		const newButton = new Button({ children: 'Добавить пользователя' });

		const chatId = Store.getState().chats.currentChat.id;

		const usersList = props.chatUsers.map((user) => createBanner(user, chatId));

		super('div', {
			class: {
				chat: styles.chat,
				chatForm: styles.chat__form,
				chatUsers: styles.chat__users,
				chatUsersInfo: styles.chat__info,
				chatUsersTitle: styles.chat__usersTitle,
				chatUsersBody: styles.chat__usersBody
			},
			newButton,
			usersList,
			...(props as Record<string, unknown>)
		});
		this.usersList = usersList;
		this.newButton = newButton;
	}

	override storePropsUpdated() {
		const currentProps = this._meta.props as PropsType;
		const chatId = Store.getState().chats.currentChat.id;
		const usersList = currentProps.chatUsers.map((user) => createBanner(user, chatId));
		this.setProps({
			...currentProps,
			usersList
		});
	}

	render(): DocumentFragment {
		return Block.compile(tmp, this.props);
	}
}

export const ChatData = withChatUsersAndChatId(_ChatData);
