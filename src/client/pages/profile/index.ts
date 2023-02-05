/* eslint-disable no-underscore-dangle */
import tmp from 'bundle-text:./index.hbs';
import { InputClass, InputPropsType } from './components/input/index';
import * as style from './style.module.scss';
import arrowImg from '../../public/arrow.png';
import avatarImg from '../../public/avatar.jpg';

import {
	EMAIL_PATTERN, LOGIN_PATTERN, NAME_PATTERN, PHONE_PATTERN
} from '../../utils/validation';
import { Block } from '../../packages';
import { Button, ButtonPropsType } from './components/button';

const fields: InputPropsType[] = [
	{
		id: 'email', label: 'Почта', pattern: EMAIL_PATTERN, value: 'some text'
	},
	{
		id: 'login', label: 'Логин', pattern: LOGIN_PATTERN, minLength: 3, maxLength: 20, value: 'some text'
	},
	{
		id: 'first_name', label: 'Имя', pattern: NAME_PATTERN, value: 'some text'
	},
	{
		id: 'last_name', label: 'Фамилия', pattern: NAME_PATTERN, value: 'some text'
	},
	{
		id: 'name_in_chat', label: 'Имя в чате', pattern: NAME_PATTERN, value: 'some text'
	},
	{
		id: 'phone', label: 'Телефон', pattern: PHONE_PATTERN, value: 'some text'
	}
];

const buttons: ButtonPropsType[] = [
	{ children: 'Изменить данные', type: 'submit' },
	{ children: 'Изменить пароль' },
	{ children: 'Выйти', type: 'warning' }
];

type PropsType = {
	fields: Block[],
	actions: Block[],
	href: string,
	name: string,
	leftBarImg: string,
	avatarImg: string,
}

class ProfilePage extends Block {
	constructor(args: PropsType) {
		super('div', {
			class: {
				pageContainer: style.pageContainer,
				leftBar: style.leftBar,
				profile: style.profile,
				profileBody: style.profile__body,
				profileHeader: style.profile__header,
				profileAvatar: style.profile__headerAvatar,
				profileName: style.profile__headerName,
				profileData: style.profile__data
			},
			...args
		});
	}

	componentDidMount(): void {
		const form = this.getContent()
			?.querySelector('form');

		const handleSubmit = (e: Event) => {
			e.preventDefault();
			const target = (e.target as HTMLFormElement);
			const isValid = target.checkValidity();
			if (isValid) {
				console.log(
					JSON.stringify(
						Object.fromEntries(
							new FormData(e.target as HTMLFormElement)
						),
						undefined,
						2
					)
				);
				target.reset();
			}
			Object.values(this._children).forEach((item) => {
				if (item instanceof InputClass) item.checkValidityOnSubmit(isValid);

			});
		};

		form?.addEventListener('submit', handleSubmit);
	}

	render(): DocumentFragment {
		return Block.compile(tmp, this.props);
	}
}

const tmp1 = new ProfilePage({
	fields: fields.map((item) => new InputClass(item)),
	actions: buttons.map((item) => new Button(item)),
	leftBarImg: arrowImg,
	avatarImg,
	href: '/',
	name: 'User name'
});

export default tmp1;
