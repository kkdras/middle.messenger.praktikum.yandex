declare namespace SignIn {
	declare interface body {
		password: string;
		login: string;
	}
}

declare namespace SignUp {
	declare interface body extends ISignInBody {
		[index: string]
		first_name: string;
		second_name: string;
		email: string;
		phone: string;
	}

	declare interface success {
		id: number;
	}

	declare interface error {
		reason: string;
	}
}
