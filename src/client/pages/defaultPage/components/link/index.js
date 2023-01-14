import Handlebars from 'handlebars';
import tmp from 'bundle-text:./index.hbs'
import * as style from './style.module.scss';

export default ({
   href = '',
   label = '',
   ...props
}) => Handlebars.compile(tmp)({
   class: {
      link: style.link
   },
   href,
   label,
   ...props
});