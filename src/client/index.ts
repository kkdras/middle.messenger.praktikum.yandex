/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */
import { Router } from './packages';
import {
	chat,
	externalError,
	loginPage,
	notFound,
	registrationPage,
	profile,
	defaultPage
} from './pages';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import style from './styles/style.scss';

const router = new Router('#root');

router
	.use('/', defaultPage)
	.use('/login', loginPage)
	.use('/externalError', externalError)
	.use('/notFound', notFound)
	.use('/chat', chat)
	.use('/profile', profile)
	.use('/registration', registrationPage);

router.start();
