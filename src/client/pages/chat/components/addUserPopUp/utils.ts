import { ChatsController, UserController } from '../../../../controllers';
import { Button } from '../../../../ui';
import defaultAvatar from '../../../../public/avatar.jpg';
import { InfoBanner } from '../infoBanner';

export const handleSearch = (e: Event) => {
	e.preventDefault();
	const form = (e.target as HTMLFormElement);
	const isValid = form.checkValidity();
	if (isValid) {
		const newChatBody = Object.fromEntries(
			new FormData(e.target as HTMLFormElement)
		) as ISearchUserBody;

		UserController.searchUser(newChatBody);
		form.reset();
	};
};

export const handleAddUser = (chatId: number, userId: number) => {
	ChatsController.addUser({
		chatId,
		users: [userId]
	});
};

const resourcesPath = process.env.RESOURCES_PATH;

export const createBanner = (chatId: number, user: IProfileData) =>
	new InfoBanner({
		avatar: (user.avatar && `${resourcesPath}/${user.avatar}`) || defaultAvatar,
		counter: '',
		message: '',
		title: user.display_name || `${user.first_name} ${user.second_name}`,
		time: '',
		button: chatId
			? new Button({
				children: 'Добавить в чат',
				events: { click: handleAddUser.bind(null, chatId, user.id) }
			})
			: undefined
	});
