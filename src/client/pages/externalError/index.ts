import { Container } from '../../ui';
import { Error } from '../../components';

const CurrentPage = new Error({
	errorTitle: '500',
	errorContent: 'Мы уже фиксим',
	linkLabel: 'Перейти на главную страницу',
	href: '/'
});

export default () => new Container({
	children: CurrentPage
});
