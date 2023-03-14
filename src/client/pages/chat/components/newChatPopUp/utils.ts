import { ChatsController } from '../../../../controllers';

export const handleCreateNewChat = (e: Event) => {
	e.preventDefault();
	const form = (e.target as HTMLFormElement);
	const isValid = form.checkValidity();
	if (isValid) {
		const newChatBody = Object.fromEntries(
			new FormData(e.target as HTMLFormElement)
		) as ICreateChat;

		ChatsController.createChat(newChatBody);
		form.reset();
	};
};
