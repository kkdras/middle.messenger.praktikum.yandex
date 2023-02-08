import { Container } from '../../ui';
import { Error } from '../../components';

const CurrentPage = new Error({
	errorTitle: '500',
	errorContent: 'Мы уже фиксим',
	errorLink: 'Назад к чатам',
	href: '/'
});

const containerInstance = new Container({
	children: CurrentPage
});

export default containerInstance;
