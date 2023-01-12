import { externalError, loginPage, notFound, registRationPage, defaultPage, chat, profile } from './pages';
import style from './styles/style.scss';

const root = document.getElementById('root');
let path = window.location.pathname.substring(1);


const selectPage =
   path === 'login' ? loginPage :
   path === 'externalError' ? externalError :
   path === 'notFound' ? notFound :
   path === 'chat' ? chat :
   path === 'profile' ? profile:
   path === 'registration' ? registRationPage : defaultPage;

root.innerHTML = selectPage;

