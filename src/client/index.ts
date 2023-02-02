import { externalError, loginPage, notFound, registRationPage, defaultPage, chat, profile } from './pages';
import style from './styles/style.scss';

const root = document.getElementById('root');
const path = (
	window.location.host.endsWith('1234')
		? window.location.pathname
		: window.location.hash
).substring(1);
const windowPath = window.location.pathname;

const selectPage =
	path === '' && windowPath === '/' ? defaultPage :
	path === 'login' ? loginPage :
	path === 'externalError' ? externalError :
	path === 'notFound' ? notFound :
	path === 'chat' ? chat :
	path === 'profile' ? profile:
	path === 'registration' ? registRationPage : notFound;

if (!root) {
	throw new Error('root container not found');
}

root.innerHTML = selectPage;

document.querySelectorAll('form').forEach((item) => {
	item.addEventListener('submit', (e) => {
		e.preventDefault();
	});
});
