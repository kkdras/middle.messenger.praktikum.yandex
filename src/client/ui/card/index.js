import Handlebars from 'handlebars';
import tmp from 'bundle-text:./index.hbs';
import * as style from './style.module.scss';

export default (props) => Handlebars.compile(tmp)({
   class: {
      card: style.card,
      cardWrapper: style.card__wrapper,
      cardBody: style.card__body,
   },
   ...props
});
