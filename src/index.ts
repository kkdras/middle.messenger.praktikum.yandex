import './styles/style.scss';
import { render } from './utils';
import {
	chat,
	externalError,
	loginPage,
	notFound,
	registrationPage,
	profile,
	defaultPage
} from './pages';
import { Block } from './packages/Block';
import { Router } from './packages/Router';

const router = new Router();

router
	.use('/', defaultPage, { isDefault: true })
	.use('/login', loginPage)
	.use('/externalError', externalError)
	.use('/notFound', notFound, { isNotFound: true })
	.use('/messenger', chat)
	.use('/profile', profile)
	.use('/registration', registrationPage);

router.on(Router.Events.PATH_CHANGE, (activePage?: Block) => {
	if (activePage) render('#root', activePage);
});

router.start();
