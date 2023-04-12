interface IBLock {
	getContent(): HTMLElement | null;
	dispatchComponentDidMount(): void;
}

export default (selector: string, component: IBLock) => {
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
