import { Container } from '../../ui';
import { Error } from '../../components';

export default Container({
   children: Error({
      errorTitle: '500',
      errorContent: 'Мы уже фиксим',
      errorLink: 'Назад к чатам',
   })
});