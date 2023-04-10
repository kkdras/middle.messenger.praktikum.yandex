import tmp from './index.hbs';
import { Block } from '../../packages/Block';
import style from './style.module.scss';

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
