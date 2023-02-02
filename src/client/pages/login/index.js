import Handlebars from 'handlebars';
import tmp from 'bundle-text:./index.hbs';
import { Button, Container, LoginTextField, Card } from '../../ui';
import * as style from './style.module.scss';

const fields = [
   { id: 'login', label: 'Логин', type: 'text' },
   { id: 'password', label: 'Пароль', type: 'password' },
];

const buttons = [
   { children: 'Авторизоваться', classes: style.form__logInButton },
   { children: 'Нет аккаунта?', type: 'outline' },
];

const CurrentPage = Handlebars.compile(tmp)({
   class: {
      form: style.form,
      formTitle: style.form__title,
   },
   children: [
      ...fields.map(item => LoginTextField(item)),
      ...buttons.map(item => Button(item)),
   ].join(''),
});

export default Container({
   children: Card({
      children: CurrentPage
   })
});