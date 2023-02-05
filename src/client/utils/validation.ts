import { Block } from '../packages';

export const NAME_PATTERN = '^[А-ЯЁA-Z][а-яёa-z-]*$';

export const LOGIN_PATTERN = '^(?:[0-9]+[A-z]|[A-z]+[0-9])[A-z0-9]*$';

export const EMAIL_PATTERN = '^[-.\\w]+@([\\w-]+\\.)+[\\w-]+$';

export const PHONE_PATTERN = '^\\+?\\d{10,15}$';

export const PASSWORD_PATTERN = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$';

type HandlerType = (e: Event)=> void

export const addValidation = (
	target: HTMLElement,
	onFocus: HandlerType,
	onBlur: HandlerType
) => {
	if (!target) throw new Error('input el not found');

	target.addEventListener('focus', onFocus);
	target.addEventListener('blur', onBlur);

	return () => {
		target.removeEventListener('focus', onFocus);
		target.removeEventListener('blur', onBlur);
	};
};

const baseEffect = (e: Event) => {
	(e.target as HTMLInputElement).checkValidity();
};
export const baseOnFocus = (e: Event) => baseEffect(e);
export const baseOnBlur = (e: Event) => baseEffect(e);

export class ValidationMixin {
	checkValidityOnSubmit(this: Block, valid: boolean) {
		const container = this.getContent() as HTMLElement;
		const input = container.querySelector('input');
		if (!input) {
			console.error('input element not found');
			return;
		}
		if (!valid) input.checkValidity();

		this._eventBus().emit('submitted');
	}

	componentDidMount(this: Block): void {
		const container = this.getContent() as HTMLElement;
		const input = container.querySelector('input');

		if (!input) {
			console.error('input element not found');
			return;
		}

		input.addEventListener('input', () => {
			input.parentElement!.classList.remove('invalid');
		});

		const removeBaseValidation = addValidation(input, baseOnFocus, baseOnBlur);

		this._eventBus().on('submitted', () => {
			removeBaseValidation();
		});

		input.addEventListener('invalid', () => {
			input.parentElement!.classList.add('invalid');
		});
	}
}

export function handleSubmit(this: Block, e: Event) {
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
	Object.values(this._children).forEach((item) => {
		if ((item as any).checkValidityOnSubmit) (item as any).checkValidityOnSubmit(isValid);
	});
}
