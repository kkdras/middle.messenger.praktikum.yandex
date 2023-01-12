import Handlebars from 'handlebars';
import tmp from 'bundle-text:./index.hbs';
import * as style from './style.module.scss';
import { classNames } from '../../../../utils';

export default ({
   text = '',
   type = '',
   classes = [],
   ...props
}) => Handlebars.compile(tmp)({
   class: {
      btn: classNames(style.btn, classes),
      btnItem: classNames(
         style.btn__item,
         { [style.btn__item_warning]: type === 'warning' }
      )
   },
   text,
   ...props
});