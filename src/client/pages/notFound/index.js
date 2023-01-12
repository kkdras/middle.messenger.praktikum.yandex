import { Container } from '../../ui';
import { Error } from '../../components';

const CurrentPage = Error({
   errorTitle: '404',
   errorContent: 'Не туда попали',
   errorLink: 'Назад к чатам',
});

export default Container({
   children: CurrentPage,
});