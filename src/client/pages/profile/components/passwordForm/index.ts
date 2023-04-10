import tmp from './index.hbs';
import style from './style.module.scss';
import { Button, ButtonPropsType } from '../button';
import { PASSWORD_PATTERN, passwordError } from '../../../../utils/validation';
import { InputClass, InputPropsType } from '../input';
import { StateType, withUserData } from '../../../../store';
import avatarImg from '../../../../public/avatar.jpg';
import { handleChangeProfileData, handleChangePassword } from './utils';
import { Block } from '../../../../packages/Block';

type FieldsKeys = 'newPassword' | 'oldPassword';

const fields: Record<FieldsKeys, InputPropsType & { instance?: InputClass }> = {
	oldPassword: {
		id: 'oldPassword',
		label: 'Старый пароль',
		pattern: PASSWORD_PATTERN,
		minLength: 8,
		maxLength: 40,
		defaultValue: '',
		errorMessage: passwordError,
		type: 'password'
	},
	newPassword: {
		id: 'newPassword',
		label: 'Новый пароль',
		pattern: PASSWORD_PATTERN,
		minLength: 8,
		maxLength: 40,
		defaultValue: '',
		errorMessage: passwordError,
		type: 'password'
	}
};

type ButtonsKeys = 'submit' | 'changeProfileData';
const buttons: Record<ButtonsKeys, ButtonPropsType & { instance?: Button }> = {
	submit: { children: 'Изменить пароль', type: 'submit' },
	changeProfileData: {
		children: 'Изменить данные',
		type: 'button',
		events: {
			click: handleChangeProfileData
		}
	}
};

type PropsType = {
	profileData: StateType['user'],
}

const resourcesPath = process.env.RESOURCES_PATH;
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
				submit: handleChangePassword
			},
			profileData
		});
		this.fieldsKeys = fieldsKeys;
	}

	render(): DocumentFragment {
		const loadedProfile = (this.props as PropsType).profileData.avatar;

		return Block.compile(tmp, {
			...this.props,
			class: {
				profile: style.profile,
				profileBody: style.profile__body,
				profileHeader: style.profile__header,
				profileAvatar: style.profile__headerAvatar,
				profileName: style.profile__headerName,
				profileData: style.profile__data,
				profileChangePassword: style.profile__data
			},
			avatarImg: loadedProfile ? resourcesPath + loadedProfile : avatarImg
		});
	}
};

const ConnectedProfileForm = withUserData(ProfileForm);

export default ConnectedProfileForm;
