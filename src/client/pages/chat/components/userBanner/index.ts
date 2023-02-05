import tmp from 'bundle-text:./index.hbs';
import { Block } from '../../../../packages';
import * as style from './style.module.scss';

export type UserBannerPropsType = {
	avatar: string,
	userName: string,
	userMessage: string,
	messageTime: string,
	// counter?: number,
}

export class UserBanner extends Block {
	constructor(args: UserBannerPropsType) {
		super('div', {
			class: {
				container: style.userBanner,
				avatar: style.userBanner__avatar,
				mainContent: style.userBanner__mainContent,
				userName: style.userBanner__userName,
				message: style.userBanner__message,
				subContent: style.userBanner__subContent,
				messageTime: style.userBanner__messageTime
			},
			...args
		});
	}

	render(): DocumentFragment {
		return Block.compile(tmp, this.props);
	}
}
