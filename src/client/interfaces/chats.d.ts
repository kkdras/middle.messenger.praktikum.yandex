declare interface ICreateChat {
	[index: string];
	title: string;
}

declare interface IChat {
	[index: string];
	id: number;
	title: string;
	avatar: string | null;
	unread_count: number;
	last_message: {
		user: {
			first_name: string;
			second_name: string;
			avatar: string;
			email: string;
			login: string;
			phone: string;
		};
		time: string;
		content: string;
	} | null;
}

declare interface IChatUserBody {
	[index: string];
	users: number[];
	chatId: number;
}

declare type ITokenResponse = { token: string };

declare interface IMessage {
	chat_id: number;
	time: string;
	type: string;
	user_id: number;
	content: string;
	file?: {
		id: number;
		user_id: number;
		path: string;
		filename: string;
		content_type: string;
		content_size: number;
		upload_date: string;
	};
}
