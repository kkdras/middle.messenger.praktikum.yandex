import tmp from './index.hbs';
import { Block, BlockEvents } from '../../../../packages/Block';
import style from './style.module.scss';

export type InfoBannerProps = {
	events?: BlockEvents;
	avatar: string;
	message: string;
	counter: string;
	title: string;
	time: string,
	button?: Block
};

export class InfoBanner extends Block {
	constructor(props: InfoBannerProps) {
		super('div', {
			class: {
				container: style.userBanner,
				avatar: style.userBanner__avatar,
				mainContent: style.userBanner__mainContent,
				userName: style.userBanner__userName,
				message: style.userBanner__message,
				subContent: style.userBanner__subContent,
				messageTime: style.userBanner__messageTime,
				counter: style.userBanner__counter
			},
			...(props as Record<string, unknown>)

		});
	}

	render(): DocumentFragment {
		return Block.compile(tmp, this.props);
	}
}
