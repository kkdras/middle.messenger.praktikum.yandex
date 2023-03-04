import Block from '../Block';
import EventBus from '../Event-bus';
import Route from './Route';

export default class Router extends EventBus {
	private history: History = window.history;
	private _indexRoutes: Record<string, Route> = {};
	private _currentView: null | Route = null;
	private static _instance: Router | null = null;
	private _defaultPathname: string | null = null;

	static Events = {
		PATH_CHANGE: 'pathChange'
	};

	constructor() {
		super();
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
		this._indexRoutes[pathname] = new Route(constructor);
		return this;
	}

	start() {
		const handleRoute = () => {
			this.go(document.location.pathname);
		};

		window.addEventListener('popstate', handleRoute);
		handleRoute();
	}

	go(pathname: string) {
		this.history.pushState({}, '', pathname);
		this._onRoute(pathname);
		this.emit(Router.Events.PATH_CHANGE, this.getActiveInstance());
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

	getActiveInstance() {
		return this._currentView?.getContent();
	}
}
