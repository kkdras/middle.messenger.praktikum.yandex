import Handlebars from 'handlebars';
import tmpl from 'bundle-text:./index.hbs';
import { RouterLink } from '../../../../packages/Router';

type PropsType = {
	href: string,
	iconPath: string,
};

export const link = ({ href, iconPath }: PropsType) => new RouterLink({
	children: Handlebars.compile(tmpl)({ iconPath }),
	href,
	classes: ['ibj'],
	type: 'back'
});
