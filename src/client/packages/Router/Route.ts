import Block from '../Block';

export default class Route {
	private _instance: Block | null = null;
	constructor(private _constructor: ()=> Block) {}

	render() {
		if (!this._instance) this._instance = this._constructor();
		else {
			this._instance.show();
		}
	}

	leave() {
		if (this._instance) {
			this._instance.hide();
			const parent = this._instance.getContent()?.parentElement;

			parent?.removeChild(this._instance.getContent() as Node);
		}
	}

	getContent() {
		return this._instance;
	}
}
