import Handlebars from 'handlebars'
import tmp from 'bundle-text:./index.hbs'
import * as style from './style.module.scss';
import { classNames } from '../../utils';

export default ({ classes = [], type = '',  ...props }) => Handlebars.compile(tmp)({
   class: {
      button: classNames(
         style.button,
         { [style.button_outlined]: type === 'outline'},
         classes
      ),
   },
   ...props,
});
