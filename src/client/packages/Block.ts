import { v4 } from 'uuid';
import { EventBus, IEventBus } from './Event-bus';

export abstract class Block<T extends Record<string, unknown> = {}> {
  static EVENTS = {
    INIT: "init",
    FLOW_CDM: "flow:component-did-mount",
    FLOW_CDU: "flow:component-did-update",
    FLOW_RENDER: "flow:render"
  };
	
  _element: HTMLElement | null = null;
  _children: Block<any>[] | null = null;

	private _meta: {
		tagName: string;
		props: null | T;
		prevProps: null | T;
	};

  id: string;
  private _eventBus: () => EventBus;
	props: Record<string, unknown>
	
  /** JSDoc
	 * @param {string} tagName
	 * @param {Object} props
	*
	* @returns {void}
	*/
	constructor(tagName = "div", props: T) {
		const eventBus = new EventBus();
		this._meta = {
			tagName,
			props,
			prevProps: null
		};
		this.id = v4();

		this._lookForChildren();

		this.props = this._makePropsProxy(props);

		this._eventBus = () => eventBus;

		this._registerEvents(eventBus);
		eventBus.emit(Block.EVENTS.INIT);
	}

  _mountChildren() {
    this._children?.forEach((el) => {
			const element = this.getContent();
      const replaceEl = element
        ?.querySelector(`${el._meta.tagName}[data-id=${el.id}]`);

      if (!replaceEl || !element) return;
      replaceEl.parentNode?.replaceChild(replaceEl, element);
    });
  }

  _lookForChildren() {
    const children: Block<any>[] = [];
    for (const key in this.props) {
      const prop = this.props[key];

      if (prop instanceof Block) {
        children.push(prop);
      }
    }

    if (children.length) {
      this._children = children;
    }
  }

  _registerEvents(eventBus: IEventBus) {
    eventBus.on(Block.EVENTS.INIT, this.init.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
    eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
  }

  _addListeners() {
    const prevEvents = this._meta.prevProps?.events || {};
    const newEvents = this._meta.props?.events || {};

    for (const eventName in newEvents) {
      const newHandler = newEvents[eventName as keyof typeof newEvents];
      const prevHandler = prevEvents[eventName as keyof typeof newEvents];

      if (newHandler === prevHandler) return;

      this.getContent()?.addEventListener(eventName, newHandler);
    }
  }

  _removeListeners() {
    const prevEvents = this._meta.prevProps?.events || {};
    const newEvents = this._meta.props?.events || {};

    for (const eventName in prevEvents) {
      const newHandler = newEvents[eventName as keyof typeof newEvents];
      const prevHandler = prevEvents[eventName as keyof typeof newEvents];

      if (newHandler !== prevHandler) {
        this.getContent()?.removeEventListener(eventName, prevHandler);
      }
    }
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
  componentDidMount() {}

  dispatchComponentDidMount() {
    this._eventBus().emit(Block.EVENTS.FLOW_CDM)
  }

  _componentDidUpdate(prevProps: T, newProps: T) {
    const needRender = this.componentDidUpdate(prevProps, newProps);
    if (needRender) {
      this._removeListeners();
      this._eventBus().emit(Block.EVENTS.FLOW_RENDER);
    }
  }

  // Может переопределять пользователь, необязательно трогать
  componentDidUpdate(prevProps: T, newProps: T) {
    return prevProps !== newProps;
  }

  setProps = (nextProps: T) => {
    if (!nextProps) {
      return;
    }

    this._meta.prevProps = this._meta.props;
    this._meta.props = nextProps;
    this._lookForChildren();
    Object.keys(nextProps).forEach(key => {
      if (!(key in (this._meta.prevProps as T))) {
        delete this.props[key];
      }
    })

    Object.assign(this.props, nextProps);
  };

  get element() {
    return this._element;
  }

	abstract render(): string;

  _render() {
    const block = this.render();

    // Этот небезопасный метод для упрощения логики
    // Используйте шаблонизатор из npm или напишите свой безопасный
    // Нужно не в строку компилировать (или делать это правильно),
    // либо сразу в DOM-элементы возвращать из compile DOM-ноду
    if (this._element )this._element.innerHTML = block;
    this._addListeners();
    this._mountChildren();
  }

  // Может переопределять пользователь, необязательно трогать

  getContent() {
    return this.element;
  }

  _makePropsProxy(userProps: T) {
    const props = deepClone(userProps);
    let timeoutUpdate: null | number = null;
    const emitCDU = () => {
      this._eventBus().emit(
        Block.EVENTS.FLOW_CDU,
        this._meta.prevProps,
        this._meta.props
      );
      timeoutUpdate = null;
    }


    const debounceWrapper = () => {
      if (!timeoutUpdate) {
        timeoutUpdate = debounceInvokeFunction(emitCDU)
      }
    }

    const proxyProps = new Proxy(props, {
      get (target, propertyName) {
        const value = target[propertyName as keyof typeof target];
        return typeof value === 'function' ? value.bind(target) : value
      },
      set (target, propertyName, newValue) {
        target[propertyName as keyof typeof target] = newValue;
        emitCDU();
        return true;
      },
      deleteProperty(target, propertyName) {
        if (!(propertyName in target))
          throw new Error('property that you try to delete does\'t exist in target object');
        delete target[propertyName as keyof typeof target];
        debounceWrapper();
        return true;
      }
    })

    return proxyProps;
  }

  _createDocumentElement(tagName: string) {
    // Можно сделать метод, который через фрагменты в цикле создаёт сразу несколько блоков
    return document.createElement(tagName);
  }

  show() {
		const el = this.getContent();
		if (el) {
			el.style.display = 'block';
		}
	}

	hide() {
		const el = this.getContent();
		if (el) {
			el.style.display = 'none';
		}
	}

	toString() {
		return `<div data-id="${this.id}"></div>`
	}
}

const debounceInvokeFunction = (callback: () => void, delay = 0) => {
  const timeout = setTimeout(() => {
    callback();
  }, delay);

  return timeout;
}


type TKey = keyof any;

type ArrTarget = unknown[];

type ObjectTarget = { [key: TKey]: unknown }

type TargetType = ArrTarget | ObjectTarget;

const deepClone = <T extends TargetType>(target: T): T => {
	function isObjectOrArray(item: unknown): item is TargetType {
		return (typeof item === 'object' || Array.isArray(item)) && !!item;
	}

	const handleObject = () => Object.entries(target)
		.reduce((acc, [key, value]) => {
			acc[key] = isObjectOrArray(value) ? deepClone(value) : value;
			return acc;
		}, {} as ObjectTarget) as T;


	const handleArray = (arr: unknown[]) =>
		arr.map(item => isObjectOrArray(item) ? deepClone(item) : item) as T;

	return Array.isArray(target) ? handleArray(target) : handleObject();
};
