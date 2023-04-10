import { Router } from '../../packages/Router';
import { Store } from '../../store';
import { ButtonPropsType, TextFieldProps } from '../../ui';
import {
	emailError,
	EMAIL_PATTERN,
	loginError,
	LOGIN_PATTERN,
	nameError,
	NAME_PATTERN,
	passwordError,
	PASSWORD_PATTERN,
	phoneError,
	PHONE_PATTERN
} from '../../utils/validation';
import style from './style.module.scss';

const onChangePasswordField = () => {
	Store.setState('app.passwordError', false);
};

export const fields: TextFieldProps[] = [
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
		errorMessage: passwordError,
		events: {
			keyup: onChangePasswordField
		}
	},
	{
		label: 'Пароль (ещё раз)',
		id: 'passwordExamination',
		type: 'password',
		pattern: PASSWORD_PATTERN,
		minLength: 8,
		maxLength: 40,
		errorMessage: passwordError,
		events: {
			keyup: onChangePasswordField
		}
	}
];

const router = new Router();

const handleExistAcc = (e: Event) => {
	e.preventDefault();
	router.go('/login');
};

export const buttons: ButtonPropsType[] = [
	{
		children: 'Зарегистрироваться',
		classes: style.form__sigInButton,
		viewType: 'outline',
		type: 'submit'
	},
	{
		children: 'Войти',
		events: {
			click: handleExistAcc
		}
	}
];
