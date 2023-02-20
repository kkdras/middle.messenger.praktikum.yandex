import Block from '../Block';

const render = (selector: string, component: Block) => {
	const rootEl = document.querySelector(selector);
	if (!rootEl) throw new Error('root element not found');
	const content = component.getContent();
	if (!content) {
		console.error('component that you try to mount equal');
		return;
	}
	rootEl.append(content);
	component.dispatchComponentDidMount();
};

export default class Route {
	private _instance: Block | null = null;
	constructor(
		private _constructor: ()=> Block,
		private _selector: string
	) {}

	render() {
		if (!this._instance) {
			this._instance = this._constructor();
			render(this._selector, this._instance);
		} else this._instance.show();
	}

	leave() {
		if (this._instance) this._instance.hide();
	}
}
