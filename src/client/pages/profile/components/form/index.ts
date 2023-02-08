import tmp from 'bundle-text:./index.hbs';
import * as style from './style.module.scss';
import { Block } from '../../../../packages';
import { Button, ButtonPropsType } from '../button';
import {
	EMAIL_PATTERN,
	handleSubmit,
	loginError,
	LOGIN_PATTERN,
	nameError,
	NAME_PATTERN,
	phoneError,
	PHONE_PATTERN,
	requiredError
} from '../../../../utils/validation';
import { InputClass, InputPropsType } from '../input';

const fields: InputPropsType[] = [
	{
		id: 'email',
		label: 'Почта',
		pattern: EMAIL_PATTERN,
		placeholder: 'some text',
		errorMessage: requiredError
	},
	{
		id: 'login',
		label: 'Логин',
		pattern: LOGIN_PATTERN,
		minLength: 3,
		maxLength: 20,
		placeholder: 'some text',
		errorMessage: loginError
	},
	{
		id: 'first_name',
		label: 'Имя',
		pattern: NAME_PATTERN,
		placeholder: 'some text',
		errorMessage: nameError
	},
	{
		id: 'second_name',
		label: 'Фамилия',
		pattern: NAME_PATTERN,
		placeholder: 'some text',
		errorMessage: nameError
	},
	{
		id: 'display_name',
		label: 'Имя в чате',
		pattern: NAME_PATTERN,
		placeholder: 'some text',
		errorMessage: nameError
	},
	{
		id: 'phone',
		label: 'Телефон',
		pattern: PHONE_PATTERN,
		placeholder: 'some text',
		errorMessage: phoneError
	}
];

const buttons: ButtonPropsType[] = [
	{ children: 'Изменить данные', type: 'submit' },
	{ children: 'Изменить пароль' },
	{ children: 'Выйти', type: 'warning' }
];

type PropsType = {
	name: string,
	avatarImg: string,
}

class ProfileForm extends Block {
	constructor(args: PropsType) {
		super('div', {
			fields: fields.map((item) => new InputClass(item)),
			actions: buttons.map((item) => new Button(item)),
			class: {
				profile: style.profile,
				profileBody: style.profile__body,
				profileHeader: style.profile__header,
				profileAvatar: style.profile__headerAvatar,
				profileName: style.profile__headerName,
				profileData: style.profile__data
			},
			events: {
				submit: handleSubmit
			},
			...args
		});
	}

	render(): DocumentFragment {
		return Block.compile(tmp, this.props);
	}
};

export default ProfileForm;
