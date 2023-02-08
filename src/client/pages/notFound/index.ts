import { Container } from '../../ui';
import { Error } from '../../components';

const CurrentPage = new Error({
	errorTitle: '404',
	errorContent: 'Не туда попали',
	errorLink: 'Назад к чатам',
	href: '/'
});

const containerInstance = new Container({
	children: CurrentPage
});

export default containerInstance;
