import tmp from 'bundle-text:./index.hbs';
import {
	Card, Container, TextField, TextFieldProps, Button, ButtonPropsType
} from '../../ui';
import * as style from './style.module.scss';
import { Block } from '../../packages';

import {
	emailError,
	EMAIL_PATTERN,
	handleSubmit,
	loginError,
	LOGIN_PATTERN,
	nameError,
	NAME_PATTERN,
	passwordError,
	PASSWORD_PATTERN,
	phoneError,
	PHONE_PATTERN
} from '../../utils/validation';

const fields: TextFieldProps[] = [
	{
		label: 'Почта',
		id: 'email',
		pattern: EMAIL_PATTERN,
		errorMessage: emailError
	},
	{
		label: 'Логин',
		id: 'login',
		pattern: LOGIN_PATTERN,
		minLength: 3,
		maxLength: 20,
		errorMessage: loginError
	},
	{
		label: 'Имя',
		id: 'first_name',
		pattern: NAME_PATTERN,
		errorMessage: nameError
	},
	{
		label: 'Фамилия',
		id: 'second_name',
		pattern: NAME_PATTERN,
		errorMessage: nameError
	},
	{
		label: 'Телефон',
		id: 'phone',
		pattern: PHONE_PATTERN,
		errorMessage: phoneError
	},
	{
		label: 'Пароль',
		id: 'password',
		type: 'password',
		pattern: PASSWORD_PATTERN,
		minLength: 8,
		maxLength: 40,
		errorMessage: passwordError
	},
	{
		label: 'Пароль (ещё раз)',
		id: 'passwordExamination',
		type: 'password',
		pattern: PASSWORD_PATTERN,
		minLength: 8,
		maxLength: 40,
		errorMessage: passwordError
	}
];

const buttons: ButtonPropsType[] = [
	{ children: 'Зарегистрироваться', classes: style.form__sigInButton, viewType: 'outline' },
	{ children: 'Войти', type: 'submit' }
];

type PropsType = {
	children: Block[]
}

class RegistrationPage extends Block {
	constructor(args: PropsType) {
		super('div', {
			class: {
				form: style.form,
				formTitle: style.form__title
			},
			...args,
			events: {
				submit: handleSubmit
			}
		});
	}

	render(): DocumentFragment {
		return Block.compile(tmp, this.props);
	}
}

const Page = new RegistrationPage({
	children: [
		...fields.map((item) => new TextField(item)),
		...buttons.map((item) => new Button(item))
	]
});

const containerInstance = new Container({
	children: new Card({ children: Page })
});

export default containerInstance;
