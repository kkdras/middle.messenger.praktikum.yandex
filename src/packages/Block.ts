/* eslint-disable no-param-reassign */
import { v4 } from 'uuid';
import Handlebars from 'handlebars';
import { IEventBus, EventBus } from './Event-bus';
import { debounceInvokeFunction, deepClone } from '../utils';

export const limitDeepCopy = (value: unknown): boolean => !(!!value
	&& typeof value === 'object'
	&& value instanceof Block);

type ExcludePrefix<T extends string> = string extends T
	? string
	: T extends ''
		? T
		: T extends `on${infer R}`
			? R
			: T

export type BlockEvents = {
	[eventName in keyof GlobalEventHandlers as ExcludePrefix<eventName>]?:
	(...args: Parameters<NonNullable<GlobalEventHandlers[eventName]>>)=> void
}

type PropsType = Record<string, unknown> & {
	events?: BlockEvents & {
		['listenOnChildOfTreePosition']?: number,
	}
}

export abstract class Block<T extends PropsType = PropsType> {
	static EVENTS = {
		INIT: 'init',
		FLOW_CDM: 'flow:component-did-mount',
		FLOW_CDU: 'flow:component-did-update',
		FLOW_RENDER: 'flow:render',
		PROPS_UPDATED: 'props-updated'
	};

	_element: HTMLElement | null = null;
	_children: Record<string, Block> = {};

	public _meta: {
		tagName: string;
		props: null | T;
		prevProps: null | T;
	};

	id: string;
	_eventBus: ()=> EventBus;
	props: PropsType;
	parent: Block | null = null;

	/** JSDoc
	 * @param {string} tagName
	 * @param {Object} props
	*
	* @returns {void}
	*/
	constructor(tagName: string, props: T) {
		const eventBus = new EventBus();
		this._meta = {
			tagName,
			props,
			prevProps: null
		};
		this.id = v4();

		this.props = this._makePropsProxy(props);
		this._writeChildren();

		this._eventBus = () => eventBus;

		this._registerEvents(eventBus);
		eventBus.emit(Block.EVENTS.INIT);
	}

	_mountChildren(element: HTMLElement) {
		if (!element) return;
		Object.values(this._children).forEach((comp) => {
			const replaceEl = element
				?.querySelector(`${comp._meta.tagName}[data-id="${comp.id}"]`);

			const newChild = comp.getContent();
			if (!replaceEl || !newChild) return;

			replaceEl.parentNode?.replaceChild(newChild, replaceEl);
		});
	}

	static compile(tmp: string, options: PropsType) {
		const prepareProps: PropsType = {};

		const checkValue = (key: any, value: unknown, target: PropsType | unknown[]) => {
			if (value instanceof Block) {
				(target as PropsType)[key] = value.toString();
				return;
			}

			if (Array.isArray(value)) {
				const arrayChildren: unknown[] = [];

				value.forEach((item, i) => {
					if (Array.isArray(item)) throw new Error('nested arrays are not supported');

					// последовательно запишим компоненты в массив
					checkValue(i, item, arrayChildren);
				});

				(target as PropsType)[key] = arrayChildren.join('');
				return;
			}
			(target as PropsType)[key] = value;
		};

		Object.entries(options)
			.forEach((item) => checkValue(...item, prepareProps));

		const textHtml = Handlebars.compile(tmp)(prepareProps);

		const template = document.createElement('template');
		template.innerHTML = textHtml;
		return template.content;
	}

	_writeChildren() {
		const children: Record<string, Block> = {};

		const checkValue = (key: any, value: unknown) => {
			if (value instanceof Block) {
				children[key] = value;
				return;
			}

			if (Array.isArray(value)) {
				value.forEach((item, i) => {
					if (Array.isArray(item)) throw new Error('nested arrays are not supported');

					checkValue(i + key, item);
				});

			}
		};

		Object.entries(this.props)
			.forEach((item) => checkValue(...item));

		this._children = children;
	}

	_registerEvents(eventBus: IEventBus) {
		eventBus.on(Block.EVENTS.INIT, this.init.bind(this));
		eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
		eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
		eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
		eventBus.on(Block.EVENTS.PROPS_UPDATED, this.propsUpdated.bind(this));
	}

	// use this method to update nested components that depend on props
	propsUpdated() { }

	// fires only when store was updated
	// use this method to update current component props
	storePropsUpdated() { }

	componentWillUnmount() { }

	dispatchComponentWillUnmount() {
		this.componentWillUnmount();
		Object.values(this._children).forEach((component) => {
			component.dispatchComponentWillUnmount();
		});
	}

	// listenOnChildOfTreePosition
	// default is 0 it mean that events will be listen on
	// 0 element that is dom container of current component
	// overwise will find the last children for indicated steps
	// for example if component tree is <div><span><a></a></span><input /></div> and
	// size is 6 element that will be listen is first a tag
	_addListeners() {
		const newEvents = this.props?.events || {};

		const onFirstChildrenNow = newEvents.listenOnChildOfTreePosition ?? 0;

		let target = this.getContent();
		let i = onFirstChildrenNow;
		while (target && i > 0) {
			const newTarget = target.firstElementChild;
			if (!newTarget) break;
			target = newTarget as HTMLElement;
			i -= 1;
		}

		if (!target) return;

		(target as any).__BlockInstance = this;

		Object.keys(newEvents).forEach((eventName) => {
			const newHandler = newEvents[eventName as keyof typeof newEvents];
			if (typeof newHandler !== 'function') return;
			target?.addEventListener(eventName, newHandler as EventListenerOrEventListenerObject);
		});
	}

	_removeListeners() {
		const prevEvents = this._meta.prevProps?.events || {};

		const onFirstChildrenPrev = prevEvents.listenOnChildOfTreePosition ?? 0;

		let target = this.getContent();
		let i = onFirstChildrenPrev;
		while(i > 0 && target) {
			const newElement = target.firstElementChild as HTMLElement;
			if (newElement) target = newElement;
			i -= 1;
		}

		if (!target) return;
		Object.keys(prevEvents).forEach((eventName) => {
			const prevHandler = prevEvents[eventName as keyof typeof prevEvents];
			if (typeof prevHandler !== 'function') return;
			target?.removeEventListener(eventName, prevHandler as EventListenerOrEventListenerObject);
		});
	}

	_createResources() {
		const { tagName } = this._meta;
		this._element = this._createDocumentElement(tagName);

		this._element.dataset.id = this.id;
	}

	init() {
		this._createResources();
		this._eventBus().emit(Block.EVENTS.FLOW_RENDER);
	}

	_componentDidMount() {
		this.componentDidMount();
	}

	// Может переопределять пользователь, необязательно трогать
	// eslint-disable-next-line class-methods-use-this
	componentDidMount() {}

	dispatchComponentDidMount(useForCurrent: boolean = true) {
		if(useForCurrent) this._eventBus().emit(Block.EVENTS.FLOW_CDM);
		this.storePropsUpdated();
		this.propsUpdated();
		Object.values(this._children).forEach((el) => {
			el.dispatchComponentDidMount();
			el.storePropsUpdated();
			el.propsUpdated();
		});
	}

	_componentDidUpdate(prevProps: T, newProps: T) {
		const needRender = this.componentDidUpdate(prevProps, newProps);
		if (needRender) this._eventBus().emit(Block.EVENTS.FLOW_RENDER);

	}

	// Может переопределять пользователь, необязательно трогать
	// eslint-disable-next-line class-methods-use-this
	componentDidUpdate(prevProps: T, newProps: T) {
		return prevProps !== newProps;
	}

	setProps = (nextProps: T) => {
		if (!nextProps) return;

		this._meta.prevProps = this._meta.props;
		this._meta.props = nextProps;
		// this._lookForChildren();
		Object.keys(nextProps).forEach((key) => {
			if (!(key in (this._meta.prevProps as T))) delete this.props[key];
		});

		Object.assign(this.props, nextProps);
		(this as unknown as Block)._eventBus().emit(Block.EVENTS.PROPS_UPDATED);
		this._writeChildren();
	};

	get element() {
		return this._element;
	}

	abstract render(): DocumentFragment;

	_render() {
		const block = this.render();

		this._removeListeners();
		this._mountChildren(block as any);

		if (this._element) {
			this._element.innerHTML = '';
			this._element.append(block);
		}

		this._addListeners();
	}

	// Может переопределять пользователь, необязательно трогать

	getContent() {
		return this.element;
	}

	_manageUpdateChildren<S>(name: keyof S, target: S, newValue: unknown): void {
		const oldValue = target[name] as unknown;
		if (
			oldValue
			&& typeof oldValue === 'object'
			&& oldValue instanceof Block
			&& oldValue !== newValue
		) this.dispatchComponentWillUnmount();
	}

	_makePropsProxy(userProps: T) {
		// eslint-disable-next-line @typescript-eslint/no-use-before-define
		const props = deepClone(userProps, limitDeepCopy);
		let timeoutUpdate: null | NodeJS.Timeout = null;
		const emitCDU = () => {
			this._eventBus().emit(
				Block.EVENTS.FLOW_CDU,
				this._meta.prevProps,
				this._meta.props
			);
			timeoutUpdate = null;
		};

		const debounceWrapper = () => {
			if (!timeoutUpdate) {
				timeoutUpdate = debounceInvokeFunction(emitCDU);
			}
		};

		const self = this;

		const proxyProps = new Proxy(props, {
			get(target, propertyName) {
				const value = target[propertyName as keyof typeof target];
				return typeof value === 'function' ? value.bind(target) : value;
			},
			set(target, propertyName, newValue) {
				if (typeof propertyName === 'symbol') throw new Error('props key must be string');

				self._manageUpdateChildren(propertyName, target, newValue);

				target[propertyName as keyof typeof target] = newValue;
				debounceWrapper();
				return true;
			},
			deleteProperty(target, propertyName) {
				if (typeof propertyName === 'symbol') throw new Error('props key must be string');

				if (!(propertyName in target)) {
					throw new Error('property that you try to delete does\'t exist in target object');
				}
				const value = target[propertyName];

				self._manageUpdateChildren(propertyName, target, undefined);
				if (
					typeof value === 'object'
					&& value instanceof Block
				) delete self._children[propertyName];

				delete target[propertyName as keyof typeof target];
				debounceWrapper();
				return true;
			}
		});

		return proxyProps;
	}

	// eslint-disable-next-line class-methods-use-this
	_createDocumentElement(tagName: string) {
		// Можно сделать метод, который через фрагменты в цикле создаёт сразу несколько блоков
		return document.createElement(tagName);
	}

	show() {
		const el = this.getContent();
		if (el) el.style.display = 'block';
	}

	hide() {
		const el = this.getContent();
		if (el) el.style.display = 'none';
		this.dispatchComponentWillUnmount();
	}

	toString() {
		return `<div data-id="${this.id}"></div>`;
	}
	[Symbol.toPrimitive]() {
		return `<div data-id="${this.id}"></div>`;
	}
}

export type BlockType = typeof Block;
