import { Block } from '../packages';

export const NAME_PATTERN = '^[А-ЯЁA-Z][а-яёa-zА-ЯЁA-Z-]*$';

export const LOGIN_PATTERN = '^(?:[0-9]+[A-z_-]|[A-z_-]+[0-9]|[A-z_-]+)[A-z0-9-_]*$';

export const EMAIL_PATTERN = '^[-.\\w]+@([\\w-]+\\.)+[\\w-]+$';

export const PHONE_PATTERN = '^\\+?\\d{10,15}$';

export const PASSWORD_PATTERN = '^(?=^.{8,40}$)((?=.*\\d)|(?=.*\\W+))(?![.\\n])(?=.*[A-Z])(?=.*[a-z]).*$';

export const DISPLAY_NAME_PATTERN = '[A-zА-яЁё0-9-_ ]+';

export const nameError = 'Первая буква должна быть заглавной, только буквы';

export const loginError = 'От 3 до 20 символов, латиница, цыфры и буквы';

export const emailError = 'Невалидный email';

export const passwordError = 'От 8 до 40 символов, хотя бы одна заглавная буква и цифра.';

export const phoneError = 'От 10 до 15 символов, цыфры, может начинается с плюса.';

export const requiredError = 'Это поле обязательно к заполнению';

export const chatNameError = 'Поле обязательно, от 4 до 40 символов';

export const displayNameError = 'Буквы, цыфры, дефис, нижнее подчеркивание';

const baseEffect = (e: Event) => {
	(e.target as HTMLInputElement).checkValidity();
};
export const baseOnFocus = (e: Event) => baseEffect(e);
export const baseOnBlur = (e: Event) => baseEffect(e);

type ExcludePrefix<T extends string> = string extends T
	? string
	: T extends ''
		? T
		: T extends `on${infer R}`
			? R
			: T

// eventBus назначит сам Block
export type InputHandlers = {
	[eventName in keyof GlobalEventHandlers as ExcludePrefix<eventName>]?:
	GlobalEventHandlers[eventName]
}
export class BaseInputHandlers {
	touched = false;

	input = (e: Event) => {
		this.touched = true;
		const blockInstance = ((e.target as any).__BlockInstance || null) as Block | null;
		blockInstance?._eventBus()?.emit?.('valid');
	};

	focus = (e: Event) => {
		if (!this.touched) return;
		(e.target as HTMLInputElement)?.checkValidity();
	};

	blur = (e: Event) => {
		this.touched = true;
		(e.target as HTMLInputElement)?.checkValidity();
	};

	invalid = (e: Event) => {
		this.touched = true;
		const blockInstance = ((e.target as any).__BlockInstance || null) as Block | null;
		blockInstance?._eventBus()?.emit('invalid');
	};
};

// по другому просто никак
// используя event так сделать не получится
// handle on click outside
export const useClickOutside = (container: Element, callback: ()=> void) => {
	const listener = (e: MouseEvent) => {
		const target = e.target as HTMLElement;
		if (container.contains(target)) return;
		callback();
	};

	document.addEventListener('click', listener);

	return () => {
		document.removeEventListener('click', listener);
	};
};
