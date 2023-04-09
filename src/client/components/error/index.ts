import tmp from 'bundle-text:./index.hbs';
import { Block } from '../../packages/Block';
import { RouterLink } from '../../packages/Router';
import * as style from './style.module.scss';

/**
 * @param props.title - основной заголовок
 * @param props.textContent - текстовое описание
 * @param props.textLink - текст ссылки
 * @param props.linkHref - адресс ссылки
 * @returns
 */

type ErrorProps = {
	errorTitle: string;
	href: string;
	errorContent: string;
	linkLabel: string;
};

class Error extends Block {
	constructor({ href, linkLabel, ...props }: ErrorProps) {
		const link = new RouterLink({
			href,
			children: linkLabel,
			classes: [style.error__link]
		});

		super('div', {
			link,
			...props
		});
	}

	render() {
		return Block.compile(tmp, {
			class: {
				container: style.container,
				error: style.error,
				errorTitle: style.error__title,
				errorContent: style.error__content,
				errorLink: style.error__link
			},
			...this.props
		});
	}
}

export default Error;
