import tmp from 'bundle-text:./index.hbs';
import * as style from './style.module.scss';
import { Block } from '../../packages';

/**
 * @param props.title - основной заголовок
 * @param props.textContent - текстовое описание
 * @param props.textLink - текст ссылки
 * @param props.linkHref - адресс ссылки
 * @returns
 */

type ErrorProps = {
	errorTitle: string,
	href: string,
	errorContent: string,
	errorLink: string,
}

class Error extends Block {
	constructor(args: ErrorProps) {
		super('div', args);
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
