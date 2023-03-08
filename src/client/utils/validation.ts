import { Block } from '../packages';

export const NAME_PATTERN = '^[А-ЯЁA-Z][а-яёa-z-]*$';

export const LOGIN_PATTERN = '^(?:[0-9]+[A-z]|[A-z]+[0-9])[A-z0-9]*$';

export const EMAIL_PATTERN = '^[-.\\w]+@([\\w-]+\\.)+[\\w-]+$';

export const PHONE_PATTERN = '^\\+?\\d{10,15}$';

export const PASSWORD_PATTERN = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$';

export const nameError = 'Первая буква должна быть заглавной, только буквы';

export const loginError = 'От 3 до 20 символов, латиница, цыфры и буквы';

export const emailError = 'Невалидный email';

export const passwordError = 'От 8 до 40 символов, хотя бы одна заглавная буква и цифра.';

export const phoneError = 'От 10 до 15 символов, цыфры, может начинается с плюса.';

export const requiredError = 'Это поле обязательно к заполнению';
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

export const BaseInputHandlers: InputHandlers = {
	input(e) {
		const blockInstance = ((e.target as any).__BlockInstance || null) as Block | null;
		blockInstance?._eventBus()?.emit?.('valid');
	},
	focus(e: Event) {
		(e.target as HTMLInputElement)?.checkValidity();
	},
	blur(e: Event) {
		(e.target as HTMLInputElement)?.checkValidity();
	},
	invalid(e) {
		const blockInstance = ((e.target as any).__BlockInstance || null) as Block | null;
		blockInstance?._eventBus()?.emit('invalid');
	}
};

export function handleSubmit(e: Event) {
	e.preventDefault();
	const form = (e.target as HTMLFormElement);
	const isValid = form.checkValidity();
	if (isValid) {
		console.log(
			JSON.stringify(
				Object.fromEntries(
					new FormData(e.target as HTMLFormElement)
				),
				undefined,
				2
			)
		);
		form.reset();
	}
}
