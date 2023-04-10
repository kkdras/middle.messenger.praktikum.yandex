import tmp from './index.hbs';
import { Store, withChatUsersAndChatId } from '../../../../store';
import styles from './style.module.scss';
import { Button } from '../../../../ui';
import { createBanner, handleAddUser } from './utils';
import { addUserPupUp } from '..';
import { debounceInvokeFunction } from '../../../../utils';
import { Block } from '../../../../packages/Block';

type PropsType = {
	chatUsers: IProfileData[];
	chatId: number;
	chatForm: Block;
	showAddUserPopUp: boolean;
};

class _ChatData extends Block {
	usersList: Block[];
	addUserPopUp: Block;
	constructor(props: PropsType) {
		const newButton = new Button({
			children: 'Добавить пользователя',
			events: {
				click: handleAddUser
			}
		});

		const chatId = Store.getState().chats.currentChat.id;

		const usersList = props.chatUsers.map((user) => createBanner(user, chatId));
		const popUpAddUser = addUserPupUp();

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
			addUserPopUp: props.showAddUserPopUp ? popUpAddUser : null,
			...(props as Record<string, unknown>)
		});
		this.usersList = usersList;
		this.addUserPopUp = popUpAddUser;
	}

	override storePropsUpdated() {
		let newProps = this._meta.props as PropsType & {
			usersList: Block[];
			addUserPopUp: Block | null;
		};
		const chatId = Store.getState().chats.currentChat.id;
		const usersList = newProps.chatUsers.map((user) => createBanner(user, chatId));
		newProps = {
			...newProps,
			usersList
		};

		if (!newProps.addUserPopUp && newProps.showAddUserPopUp === true) {
			newProps = { ...newProps, addUserPopUp: this.addUserPopUp };
			debounceInvokeFunction(this.dispatchComponentDidMount.bind(this, false));
		} else if (newProps.addUserPopUp && newProps.showAddUserPopUp === false) {
			newProps = { ...newProps, addUserPopUp: null };
		}

		this.setProps(newProps);
	}

	render(): DocumentFragment {
		return Block.compile(tmp, this.props);
	}
}

export const ChatData = withChatUsersAndChatId(_ChatData);
