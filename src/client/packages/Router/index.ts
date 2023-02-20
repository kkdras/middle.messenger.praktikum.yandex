import Block from '../Block';
import Route from './Route';

export default class Router {
	private history: History = window.history;
	private _indexRoutes: Record<string, Route> = {};
	private _currentView: null | Route = null;
	private static _instance: Router | null = null;
	private _defaultPathname: string | null = null;

	constructor(
		private _rootSelector: string
	) {
		// eslint-disable-next-line no-constructor-return
		if (Router._instance) return Router._instance;
		Router._instance = this;
	}

	_onRoute(pathname: string) {
		const route = this.getRoute(pathname);
		if (route) {
			this._currentView?.leave();
			this._currentView = route;
			route.render();
		} else if (this._defaultPathname) this.go(this._defaultPathname);
	}

	use(pathname: string, constructor: ()=> Block, isDefault?: true) {
		if (isDefault) this._defaultPathname = pathname;
		this._indexRoutes[pathname] = new Route(constructor, this._rootSelector);
		return this;
	}

	start() {
		const handleRoute = () => {
			this._onRoute(document.location.pathname);
		};

		window.addEventListener('popstate', handleRoute);
		handleRoute();
	}

	go(pathname: string) {
		this.history.pushState({}, '', pathname);
		this._onRoute(pathname);
	}

	forward() {
		this.history.forward();
	}

	back() {
		this.history.back();
	}

	getRoute(pathname: string) {
		return this._indexRoutes[pathname] as Route | undefined;
	}
}
