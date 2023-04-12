import tmp from './index.hbs';
import { chatNameError, useClickOutside } from '../../../../utils/validation';
import style from './style.module.scss';
import {
	Button,
	ButtonPropsType,
	Card,
	TextField,
	TextFieldProps
} from '../../../../ui';
import { handleSearch, createBanner } from './utils';
import { Store, withAddUserPopUpProps } from '../../../../store';
import { Block } from '../../../../packages/Block';

const fields: TextFieldProps[] = [
	{
		id: 'login',
		label: 'Найти пользователя используя логин',
		type: 'login',
		minLength: 4,
		maxLength: 40,
		errorMessage: chatNameError
	}
];

const buttons: ButtonPropsType[] = [
	{ children: 'Найти', classes: style.form__logInButton, type: 'submit' }
];

type PropsType = {
	searchList: IProfileData[],
	chatId: number;
}

class _AddUserPopUp extends Block {
	isFirstRender: boolean;
	removeListeners: (()=> void)[] = [];

	constructor(props: PropsType) {
		const searchList = props.searchList.map(createBanner.bind(null, props.chatId));

		super('div', {
			class: {
				form: style.form,
				formTitle: style.form__title,
				searchResults: style.searchResults
			},
			events: {
				submit: handleSearch,
				listenOnChildOfTreePosition: 1
			},
			children: [
				...fields.map((item) => new TextField(item)),
				...buttons.map((item) => new Button(item))
			],
			searchResults: searchList.length ? searchList : 'Пользователей не найдено',
			...props
		});
		this.isFirstRender = true;
	}

	handleClickOutside() {
		Store.setState('app.showAddUserPopUp', false);
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

	override storePropsUpdated() {
		const currentProps = this._meta.props as PropsType;
		const searchList = currentProps.searchList.map(
			createBanner.bind(null, currentProps.chatId)
		);

		this.setProps({
			...currentProps,
			searchResults: searchList.length ? searchList : 'Пользователей не найдено'
		});
	}

	render(): DocumentFragment {
		return Block.compile(tmp, this.props);
	}
}

const AddUserPopUp = withAddUserPopUpProps(_AddUserPopUp);

export default () => new Card({
	children: new AddUserPopUp({}),
	blackout: true
});
