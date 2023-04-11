import { Container } from '../../ui';
import { Error } from '../../components';

const CurrentPage = new Error({
	errorTitle: '404',
	errorContent: 'Не туда попали',
	linkLabel: 'Перейти на главную страницу',
	href: '/'
});

export default () => new Container({
	children: CurrentPage
});
