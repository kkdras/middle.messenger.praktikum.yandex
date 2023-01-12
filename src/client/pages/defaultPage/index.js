import Handlebars from 'handlebars';
import tmp from 'bundle-text:./index.hbs';
import { Container, Card } from '../../ui';
import * as style from './style.module.scss';
import { Link } from './components';

const links = [
   { label: 'not found page', href: '/notFound' },
   { label: 'external error page', href: '/externalError' },
   { label: 'logIn page', href: '/login' },
   { label: 'registration page', href: '/registration' },
   { label: 'chat', href: '/chat' },
   { label: 'profile', href: '/profile' },
];

const CurrentPage = Handlebars.compile(tmp)({
   class: {
      title: style.title,
      navContainer: style.navContainer
   },
   children: links.map(item => Link({...item})).join('')
});

export default Container({
   children: Card({
      children: CurrentPage
   })
});