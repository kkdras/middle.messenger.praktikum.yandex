import Handlebars from 'handlebars';
import tmp from 'bundle-text:./index.hbs';
import * as style from './style.module.scss';
import { classNames } from '../../../../utils';

export default ({
   type = 'text',
   labelText = '',
   id = '',
   classes = [],
   value = 'some text',
   ...props
}) => Handlebars.compile(tmp)({
   class: {
      input: classNames(style.input, classes),
   },
   id,
   labelText,
   type,
   value,
   ...props
});