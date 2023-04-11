import { ChatsController } from '../../../../controllers';
import { Block } from '../../../../packages/Block';
import { Message } from '../message';

export const createMessage = (
	currentUserId: number,
	users: IProfileData[],
	message: IMessage
): Block => {
	const time = new Date(message.time);
	const isOwnMessage = currentUserId === message.user_id;
	const userId = message.user_id;

	return new Message({
		message: message.content,
		their: !isOwnMessage,
		time: `${time.getHours()}:${time.getMinutes()}`,
		name:
			(!isOwnMessage
				&& users.find((user) => user.id === userId)?.display_name)
				|| ''
	});
};

export const renderNewMessages = (
	listMessages: Block[],
	messagesData: IMessage[],
	messageCreator: (arg: IMessage)=> Block
): Block[] => {
	const result = [] as Block[];
	if (listMessages.length === messagesData.length) return result;

	for (let i = listMessages.length; i < messagesData.length; i++) {
		result.push(messageCreator(messagesData[i]));
	}
	return result;
};

export const handleSubmit = (e: Event) => {
	e.preventDefault();
	const form = e.target as HTMLFormElement;
	const isValid = form.checkValidity();
	if (isValid) {
		const messageData = Object.fromEntries(
			new FormData(e.target as HTMLFormElement)
		) as { message: string };

		ChatsController.sendMessage(messageData.message);
	}
};
