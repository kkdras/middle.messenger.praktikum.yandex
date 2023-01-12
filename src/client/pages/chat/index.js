import Handlebars from 'handlebars';
import tmp from 'bundle-text:./index.hbs';
import { Container } from '../../ui';
import * as style from './style.module.scss';

const CurrentPage = Handlebars.compile(tmp)({
   class: {
      chat: style.chat,
      chatUsers: style.chat__users,
      chatActions: style.chat__actions,
      chatProfileLink: style.chat__profileLink,
      chatSearch: style.chat__search,
      chatDialog: style.chat__dialog
   },
   chatClass: style.chat,
})

export default Container({
   children: CurrentPage
})