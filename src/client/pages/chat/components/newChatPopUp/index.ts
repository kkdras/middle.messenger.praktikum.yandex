import tmp from 'bundle-text:./index.hbs';
import { chatNameError, useClickOutside } from '../../../../utils/validation';
import * as style from './style.module.scss';
import { Block } from '../../../../packages';
import {
	Button,
	ButtonPropsType,
	Card,
	TextField,
	TextFieldProps
} from '../../../../ui';
import { handleCreateNewChat } from './utils';
import { Store } from '../../../../store';

const fields: TextFieldProps[] = [
	{
		id: 'title',
		label: 'Название чата',
		type: 'text',
		minLength: 4,
		maxLength: 40,
		errorMessage: chatNameError
	}
];

const buttons: ButtonPropsType[] = [
	{ children: 'Создать чат', classes: style.form__logInButton, type: 'submit' }
];

class NewChatPopUp extends Block {
	isFirstRender: boolean;
	removeListeners: (()=> void)[] = [];

	constructor() {
		super('div', {
			class: {
				form: style.form,
				formTitle: style.form__title
			},
			events: {
				submit: handleCreateNewChat,
				listenOnChildOfTreePosition: 1
			},
			children: [
				...fields.map((item) => new TextField(item)),
				...buttons.map((item) => new Button(item))
			]
		});
		this.isFirstRender = true;
	}

	handleClickOutside() {
		Store.setState('app.showNewChatPopUp', false);
	}

	override componentDidMount() {
		const popUp = this.getContent();
		if (!popUp) return;

		this.removeListeners.push(useClickOutside(popUp, this.handleClickOutside));
	}

	override componentWillUnmount() {
		this.removeListeners.forEach((item) => item());
		this.removeListeners = [];
	}

	render(): DocumentFragment {
		return Block.compile(tmp, this.props);
	}
}

export default () => new Card({
	children: new NewChatPopUp(),
	blackout: true
});
