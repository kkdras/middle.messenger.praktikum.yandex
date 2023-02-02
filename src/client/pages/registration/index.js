import Handlebars from 'handlebars';
import tmp from 'bundle-text:./index.hbs';
import { Button, Container, LoginTextField, Card } from '../../ui';
import * as style from './style.module.scss';

const fields = [
   { label: 'Почта', id: 'email' },
   { label: 'Логин', id: 'login' },
   { label: 'Имя', id: 'first_name' },
   { label: 'Фамилия', id: 'second_name' },
   { label: 'Телефон', id: 'phone' },
   { label: 'Пароль', id: 'password', type: 'password' },
   { label: 'Пароль (ещё раз)',  id: 'passwordExamination', type: 'password' },
];

const buttons = [
   { children: 'Зарегистрироваться', classes: style.form__sigInButton },
   { children: 'Войти', type: 'outline' },
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
   }),
});