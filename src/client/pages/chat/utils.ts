import { InfoBannerProps } from './components';
import { ChatsController } from '../../controllers';
import { Store } from '../../store';
import defaultAvatar from '../../public/avatar.jpg';

export const handleCreateNewChat = (e: Event) => {
	e.preventDefault();

	Store.setState('app.showNewChatPopUp', true);
};

export const handleLoadChat = (chatId: number) => {
	ChatsController.startChat(chatId);
};

export const transformChatProps = (props: IChat): InfoBannerProps => {
	const date = props.last_message?.time
		? new Date(props.last_message.time)
		: null;

	const avatar = props.avatar
		? `https://ya-praktikum.tech/api/v2/resources/${props.avatar}`
		: defaultAvatar;

	return {
		avatar,
		counter: String(props.unread_count || ''),
		message: props.last_message?.content || '',
		time: date ? `${date?.getHours() || ''}:${date?.getMinutes() || ''}` : '',
		title: props.title
	};
};
