import { ChatsController } from '../../../../controllers';
import { Store } from '../../../../store';
import { Button } from '../../../../ui';
import defaultAvatar from '../../../../public/avatar.jpg';
import { InfoBanner } from '../infoBanner';

export const handleDeleteUser = (chatId: number, userId: number) => {
	ChatsController.deleteUser({
		chatId,
		users: [userId]
	});
};

export const handleAddUser = (e: Event) => {
	e.preventDefault();
	Store.setState('app.showAddUserPopUp', true);
};

export const createBanner = (user: IProfileData, chatId: number) =>
	new InfoBanner({
		avatar: (user.avatar && `https://ya-praktikum.tech/api/v2/resources/${user.avatar}`) || defaultAvatar,
		counter: '',
		message: '',
		title: user.display_name || `${user.first_name} ${user.second_name}`,
		time: '',
		button: chatId
			? new Button({
				children: 'Удалить',
				events: { click: handleDeleteUser.bind(null, chatId, user.id) }
			})
			: undefined
	});
