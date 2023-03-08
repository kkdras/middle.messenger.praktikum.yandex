import tmp from 'bundle-text:./index.hbs';
import * as style from './style.module.scss';
import { Block } from '../../../../packages';
import { Button, ButtonPropsType } from '../button';
import {
	EMAIL_PATTERN,
	loginError,
	LOGIN_PATTERN,
	nameError,
	NAME_PATTERN,
	phoneError,
	PHONE_PATTERN,
	requiredError
} from '../../../../utils/validation';
import { InputClass, InputPropsType } from '../input';
import { StateType, withUserData } from '../../../../store';
import avatarImg from '../../../../public/avatar.jpg';
import { handleLogout, handleUpdateProfile } from './utils';

type FieldsKeys = Exclude<keyof StateType['user'], 'avatar' | 'id'>

const fields: Record<FieldsKeys, InputPropsType & { instance?: InputClass }> = {
	email: {
		id: 'email',
		label: 'Почта',
		pattern: EMAIL_PATTERN,
		defaultValue: '',
		errorMessage: requiredError
	},
	login: {
		id: 'login',
		label: 'Логин',
		pattern: LOGIN_PATTERN,
		minLength: 3,
		maxLength: 20,
		defaultValue: '',
		errorMessage: loginError
	},
	first_name: {
		id: 'first_name',
		label: 'Имя',
		pattern: NAME_PATTERN,
		defaultValue: '',
		errorMessage: nameError
	},
	second_name: {
		id: 'second_name',
		label: 'Фамилия',
		pattern: NAME_PATTERN,
		defaultValue: '',
		errorMessage: nameError
	},
	display_name: {
		id: 'display_name',
		label: 'Имя в чате',
		pattern: NAME_PATTERN,
		defaultValue: '',
		errorMessage: nameError
	},
	phone: {
		id: 'phone',
		label: 'Телефон',
		pattern: PHONE_PATTERN,
		defaultValue: '',
		errorMessage: phoneError
	}
};

type ButtonsKeys = 'submit' | 'changePassword' | 'exit';
const buttons: Record<ButtonsKeys, ButtonPropsType & { instance?: Button }> = {
	submit: { children: 'Изменить данные', type: 'submit' },
	changePassword: {
		children: 'Изменить пароль'
	},
	exit: {
		children: 'Выйти',
		type: 'warning',
		events: {
			click: handleLogout
		}
	}
};

type PropsType = {
	profileData: StateType['user'],
}

class ProfileForm extends Block {
	fieldsKeys: FieldsKeys[];
	constructor({ profileData }: PropsType) {
		const fieldsKeys = Object.keys(fields).map((key) => {
			const fieldDefaultProps = fields[key as FieldsKeys];
			fields[key as FieldsKeys].instance = new InputClass(fieldDefaultProps);

			return key;
		}) as FieldsKeys[];

		const buttonsKeys = Object.keys(buttons).map((key) => {
			const defaultProps = buttons[key as ButtonsKeys];
			buttons[key as ButtonsKeys].instance = new Button(defaultProps);
			return key;
		}) as ButtonsKeys[];

		super('div', {
			fields: fieldsKeys.map((key) => fields[key].instance),
			actions: buttonsKeys.map((key) => buttons[key].instance),
			events: {
				submit: handleUpdateProfile
			},
			profileData
		});
		this.fieldsKeys = fieldsKeys;
	}

	override propsUpdated() {
		this.fieldsKeys.forEach((key) => {
			const fieldData = fields[key];
			const newValue = (this.props as PropsType).profileData[key as FieldsKeys];
			const prevProps = fieldData.instance!._meta.props;
			const nextProps = {
				...prevProps,
				defaultValue: newValue
			};

			fieldData.instance!.setProps(nextProps);
		});
	}

	render(): DocumentFragment {
		return Block.compile(tmp, {
			...this.props,
			class: {
				profile: style.profile,
				profileBody: style.profile__body,
				profileHeader: style.profile__header,
				profileAvatar: style.profile__headerAvatar,
				profileName: style.profile__headerName,
				profileData: style.profile__data
			},
			avatarImg: (this.props as StateType['user']).avatar || avatarImg
		});
	}
};

const ConnectedProfileForm = withUserData(ProfileForm);

export default ConnectedProfileForm;
