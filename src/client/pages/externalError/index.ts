import { Container } from '../../ui';
import { Error } from '../../components';

const CurrentPage = new Error({
	errorTitle: '500',
	errorContent: 'Мы уже фиксим',
	linkLabel: 'Назад к чатам',
	href: '/'
});

export default () => new Container({
	children: CurrentPage
});
