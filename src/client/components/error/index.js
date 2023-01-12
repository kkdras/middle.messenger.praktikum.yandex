import Handlebars from 'handlebars';
import tmp from 'bundle-text:./index.hbs';
import * as style from './style.module.scss';


/**
 * @param props.title - основной заголовок
 * @param props.textContent - текстовое описание
 * @param props.textLink - текст ссылки
 * @param props.linkHref - адресс ссылки
 * @returns
 */

export default ({
   errorTitle = '',
   errorContent = '',
   errorLink = '',
   href = '/',
   ...props
}) => Handlebars.compile(tmp)({
   class: {
      container: style.container,
      error: style.error,
      errorTitle: style.error__title,
      errorContent: style.error__content,
      errorLink: style.error__link
   },
   errorTitle,
   href,
   errorContent,
   errorLink,
   ...props
});
