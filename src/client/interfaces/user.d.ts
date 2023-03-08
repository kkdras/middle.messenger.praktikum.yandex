declare interface IBaseProfileData {
	[index: string]
	first_name: string;
	second_name: string;
	display_name: string | null;
	login: string;
	email: string;
	phone: string;
}

declare interface IProfileData extends IBaseProfileData {
	id: number;
	avatar: string | null;
}
