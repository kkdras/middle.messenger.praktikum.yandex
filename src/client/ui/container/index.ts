import tmp from 'bundle-text:./index.hbs';
import { Block } from '../../packages/Block';
import * as style from './style.module.scss';

class Container extends Block {
	constructor(args: { children: Block | string }) {
		super('div', args);
	}

	render() {
		return Block.compile(tmp, {
			class: {
				main: style.main,
				section: style.section
			},
			...this.props
		});
	}
}

export default Container;
