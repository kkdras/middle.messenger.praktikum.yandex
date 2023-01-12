import Handlebars from 'handlebars'
import tmp from 'bundle-text:./index.hbs'
import * as style from './style.module.scss'
import { classNames } from '../../utils'

export default ({
   type = 'text',
   error = false,
   ...props
}) => Handlebars.compile(tmp)({
   class: {
      field: classNames(
         style.field,
         { [style.field_error]: error },
      ),
      fieldLabel: style.field__label,
      fieldInput: style.field__input,
   },
   type,
   ...props
})