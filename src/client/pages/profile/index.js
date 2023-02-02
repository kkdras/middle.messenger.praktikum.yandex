import Handlebars from 'handlebars';
import tmp from 'bundle-text:./index.hbs';
import { Container } from '../../ui';
import { Button, Input } from './components';
import * as style from './style.module.scss';
import arrowImg from './../../public/arrow.png';
import avatarImg from './../../public/avatar.jpg';

const fields = [
   { id: 'email', label: 'Почта' },
   { id: 'login', label: 'Логин' },
   { id: 'first_name', label: 'Имя' },
   { id: 'last_name', label: 'Фамилия' },
   { id: 'name_in_chat', label: 'Имя в чате' },
   { id: 'phone', label: 'Телефон' }
];

const buttons = [
   { children: 'Изменить данные' },
   { children: 'Изменить пароль' },
   { children: 'Выйти', type: 'warning' }
];

const CurrentPage = Handlebars.compile(tmp)({
   class: {
      pageContainer: style.pageContainer,
      leftBar: style.leftBar,
      profile: style.profile,
      profileBody: style.profile__body,
      profileHeader: style.profile__header,
      profileAvatar: style.profile__headerAvatar,
      profileName: style.profile__headerName,
      profileData: style.profile__data
   },
   tmpFields: fields.map(item => Input(item)).join(''),
   tmpActions: buttons.map(item => Button(item)).join(''),
   leftBarImg: arrowImg,
   avatarImg,
   href: '/',
   name: 'User name'
});

export default Container({
   children: CurrentPage
});