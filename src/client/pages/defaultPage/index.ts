import tmp from 'bundle-text:./index.hbs';
import * as style from './style.module.scss';
import { Link } from './components';
import { Block } from '../../packages';
import { LinkPropsType } from './components/link';
import { Card, Container } from '../../ui';

const links: LinkPropsType[] = [
	{ label: 'not found page', href: '/notFound' },
	{ label: 'external error page', href: '/externalError' },
	{ label: 'logIn page', href: '/login' },
	{ label: 'registration page', href: '/registration' },
	{ label: 'chat', href: '/chat' },
	{ label: 'profile', href: '/profile' }
];

type PropsType = {
	children: Block[]
}

class RegistrationPage extends Block {
	constructor(args: PropsType) {
		super('div', {
			class: {
				title: style.title,
				navContainer: style.navContainer
			},
			...args
		});
	};

	render(): DocumentFragment {
		return Block.compile(tmp, this.props);
	}
}

const page = new RegistrationPage({
	children: links.map((item) => new Link(item))
});

export default new Container({
	children: new Card({
		children: page
	})
});
