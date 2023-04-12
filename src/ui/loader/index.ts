import tmpl from './index.hbs';
import styles from './style.module.scss';
import { withLoader } from '../../store';
import spinner from '../../public/spinner.gif';
import { classNames } from '../../utils';
import { Block } from '../../packages/Block';

type PropsType = {
	loader: number;
}

class Loader extends Block {
	constructor({ loader }: PropsType) {
		super('div', { loader });
	}

	render() {
		const loader = this.props.loader as number;
		return Block.compile(tmpl, {
			...this.props,
			class: {
				container:
					classNames(styles.container, { [styles.hidden]: loader <= 0 }),
				body: styles.body
			},
			spinner
		});
	}
}

const ConnectedLoader = withLoader(Loader);
export default ConnectedLoader;
