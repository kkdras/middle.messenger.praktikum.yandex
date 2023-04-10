import Handlebars from 'handlebars';
import tmp from './index.hbs';
import { RouterLink } from '../../../../packages/Router';

type PropsType = {
	href: string,
	iconPath: string,
};

export const link = ({ href, iconPath }: PropsType) => new RouterLink({
	children: Handlebars.compile(tmp)({ iconPath }),
	href,
	classes: ['ibj'],
	type: 'back'
});
