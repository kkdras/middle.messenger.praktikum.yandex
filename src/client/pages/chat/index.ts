/* eslint-disable no-underscore-dangle */
import tmp from 'bundle-text:./index.hbs';
import { UserBanner, UserBannerPropsType } from './components/userBanner/index';
import * as style from './style.module.scss';
import { Block } from '../../packages';

import avatar from '../../public/avatar.jpg';
import { handleSubmit } from '../../utils/validation';
import { Button, TextField } from '../../ui';

type PropsType = {
	users: Block[],
	addButton: Block,
	submitButton: Block,
	input: Block,
}

const users: UserBannerPropsType[] = [
	{
		avatar,
		messageTime: '12:22',
		userMessage: 'Как тебе the last of us',
		userName: 'Алена Аленушкина'
	},
	{
		avatar,
		messageTime: '12:22',
		userMessage: 'Как тебе the last of us',
		userName: 'Алена Аленушкина'
	},
	{
		avatar,
		messageTime: '12:22',
		userMessage: 'Как тебе the last of usКак тебе the last of usКак тебе the last of us',
		userName: 'Алена Аленушкина'
	}
];

class ChatPage extends Block {
	constructor(args: PropsType) {
		super('div', {
			class: {
				chat: style.chat,
				chatUsers: style.chat__users,
				chatActions: style.chat__actions,
				chatProfileLink: style.chat__profileLink,
				chatSearch: style.chat__search,
				chatDialog: style.chat__dialog,
				form: style.chat__form,
				fileInput: style.chat__fileInput
			},
			...args
		});
	}

	componentDidMount(): void {
		(() => {
			const content = this.getContent();
			if (!content) return;
			const input = content.querySelector('input[name="file"]') as HTMLInputElement;
			if (!input) return;

			const addButtonComponent = this._children['addButton'].getContent();
			if (!addButtonComponent) return;
			const button = addButtonComponent.querySelector('button');
			if (!button) return;

			button.addEventListener('click', () => {
				input.click();
			});
		})();

		(() => {
			const form = this.getContent()?.querySelector('form');
			if (!form) console.error('form not found');
			form?.addEventListener('submit', handleSubmit.bind(this));
		})();
	}

	render() {
		return Block.compile(tmp, this.props);
	}
}

const submitButton = new Button({
	children: 'Отправить',
	type: 'submit'
});

const addButton = new Button({
	children: 'Прикрепить',
	type: 'button'
});

const input = new TextField({
	id: 'message',
	label: '',
	error: false,
	maxLength: 255,
	required: true,
	placeholder: 'Введите сообщение'
});

export default () => new ChatPage({
	addButton,
	users: users.map((item) => new UserBanner(item)),
	submitButton,
	input
});
