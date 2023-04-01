import tmpl from 'bundle-text:./index.hbs';
import Router from '../../Router';
import Block from '../../../Block';
import { classNames } from '../../../../utils';

type PropsType = {
	classes?: Parameters<typeof classNames>;
	href: string;
	events?: Record<string, (e: Event)=> void>;
	children: string;
	type?: 'back';
};

const router = new Router();

class RouterLink extends Block {
	constructor({ events = {}, classes = [], ...props }: PropsType) {
		super('div', {
			class: classNames(classes),
			events: {
				click: (e: Event) => {
					e.preventDefault();
					const path = (e.currentTarget as HTMLAnchorElement).href.replace(document.location.origin, '');
					if (props.type === 'back') router.back();
					else router.go(path);
				},
				listenOnChildOfTreePosition: 1,
				...events
			},
			...props
		});
	}

	render() {
		return Block.compile(tmpl, this.props);
	}
}

export default RouterLink;
