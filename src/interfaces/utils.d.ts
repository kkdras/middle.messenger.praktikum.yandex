declare type IResponse<T> = {
	json: T,
	status: number
}

declare interface IPasswordBody {
	[index: string]: string
	oldPassword: string
	newPassword: string
}

declare interface IPropsWithClass {
	class: {}
}
