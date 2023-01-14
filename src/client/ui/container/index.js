import Handlebars from 'handlebars';
import tmp from 'bundle-text:./index.hbs';
import * as style from './style.module.scss';

/**
 * 
 * @param props.children дынные которые будут проброшены
 * @returns 
 */

export default (props) => Handlebars.compile(tmp)({
   class: {
      main: style.main,
      section: style.section,
   },
   ...props
});


