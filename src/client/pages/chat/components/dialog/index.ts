import tmp from 'bundle-text:./index.hbs';
import * as styles from './style.module.scss';
import { withDialogProps } from '../../../../store';
import { createMessage, handleSubmit, renderNewMessages } from './utils';
import { Button } from '../../../../ui';
import { Block } from '../../../../packages/Block';

type PropsType = {
	messages: IMessage[];
	id: number;
	users: IProfileData[];
};

class _Dialog extends Block {
	listMessages: Block[];
	constructor(props: PropsType) {
		const listMessages = props.messages.map(
			createMessage.bind(null, props.id, props.users)
		);

		super('div', {
			class: {
				dialog: styles.dialog,
				dialogBody: styles.dialog__body,
				dialogForm: styles.dialog__form,
				dialogField: styles.dialog__field
			},
			listMessages,
			placeholder: 'Сообщение',
			events: {
				submit: handleSubmit,
				listenOnChildOfTreePosition: 2
			},
			button: new Button({ children: 'Отправить', type: 'submit' }),
			...props
		});
		this.listMessages = listMessages;
	}

	override storePropsUpdated() {
		const currentProps = this._meta.props as PropsType;

		const newMessages = renderNewMessages(
			this.listMessages,
			currentProps.messages,
			createMessage.bind(null, currentProps.id, currentProps.users)
		);

		this.setProps({
			...currentProps,
			listMessages: [...this.listMessages, ...newMessages]
		});

		setTimeout(() => {
			const messagesContainer = this.getContent()
				?.querySelector('div[data-type=\'messagesContainer\']');

			messagesContainer?.scrollBy({
				behavior: 'smooth',
				top: messagesContainer.scrollHeight
			});
		}, 100);
	}

	render(): DocumentFragment {
		return Block.compile(tmp, this.props);
	}
}

export const Dialog = withDialogProps(_Dialog);
