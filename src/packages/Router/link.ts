import { Block } from '../Block';
import Router from './Router';

const router = new Router();

type BlockProps = ConstructorParameters<typeof Block>[1];

function createLink<
	T extends abstract new(...args: any[])=> Block
>(superClass: T, position: number) {
	abstract class LinkMixin extends superClass {
		constructor(...args: any[]) {
			const [{ events, ...restProps }, ...rest] = args as [BlockProps, ...any[]];
			super(
				{
					...restProps,
					events: {
						...events,
						click(e: Event) {
							e.preventDefault();
							const path = (e.target as HTMLAnchorElement).href;
							router.go(path.replace(document.location.origin, ''));
						},
						listenOnChildOfTreePosition: position
					} as typeof events
				},
				...rest
			);
		}
	};
	return LinkMixin;
}

export default createLink;
