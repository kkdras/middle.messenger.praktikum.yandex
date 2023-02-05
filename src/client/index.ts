/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */
import { Block } from './packages';
import {
	chat,
	externalError,
	loginPage,
	notFound,
	registRationPage,
	profile,
	defaultPage
} from './pages';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import style from './styles/style.scss';

const root = document.getElementById('root');
const path = (
	window.location.host.endsWith('1234')
		? window.location.pathname
		: window.location.hash
).substring(1);
const windowPath = window.location.pathname;

const selectPage =	path === '' && windowPath === '/' ? defaultPage
	: path === 'login' ? loginPage
		: path === 'externalError' ? externalError
			: path === 'notFound' ? notFound
				: path === 'chat' ? chat
					: path === 'profile' ? profile
						: path === 'registration' ? registRationPage : notFound;

if (!root) throw new Error('root container not found');

const render = (rootEl: HTMLElement, component: Block) => {
	rootEl.innerHTML = '';
	const content = component.getContent();
	if (!content) {
		console.error('content is null on render function');
		return;
	}
	rootEl.append(content);
	component.dispatchComponentDidMount();
};

render(root, selectPage);
