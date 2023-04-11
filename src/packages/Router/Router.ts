import { dropLast } from '../../utils';
import { Block } from '../Block';
import { EventBus } from '../Event-bus';
import Route from './Route';

type PathOptions = {
	isDefault?: boolean;
	isNotFound?: boolean;
};

export default class Router extends EventBus {
	private _history: History = window.history;
	// use for check when user try to go out from app
	private _customHistoryState: string[];
	private _indexRoutes: Record<string, Route> = {};
	private _currentView: null | Route = null;
	private static _instance: Router | null = null;
	private _defaultPathname: string | null = null;
	private _notFoundPathname: string | null = null;

	static Events = {
		PATH_CHANGE: 'pathChange'
	};

	constructor() {
		super();
		this._customHistoryState = (window.history.state as string[]) ?? [];
		// eslint-disable-next-line no-constructor-return
		if (Router._instance) return Router._instance;
		Router._instance = this;
	}

	private _onRoute(pathname: string) {
		let route = this.getRoute(pathname);
		let usedDefaultPathname = false;
		if (!route && this._notFoundPathname) {
			route = this.getRoute(this._notFoundPathname);
			usedDefaultPathname = true;
		}

		if (!route) return;

		if (usedDefaultPathname) {
			this._customHistoryState = dropLast(1, this._customHistoryState);

			this._customHistoryState.push(this._notFoundPathname as string);

			this._history.replaceState(
				dropLast(1, this._customHistoryState),
				'',
				this._notFoundPathname
			);
		}

		this._currentView?.leave();
		this._currentView = route;
		route.render();

		this.emit(Router.Events.PATH_CHANGE, this._getActiveInstance());
	}

	use(
		pathname: string,
		constructor: (()=> Block),
		{ isDefault, isNotFound }: PathOptions = {}
	) {
		if (isNotFound) this._notFoundPathname = pathname;
		if (isDefault) this._defaultPathname = pathname;
		this._indexRoutes[pathname] = new Route(constructor);
		return this;
	}

	start() {
		const handleRoute = () => {
			// use prevHistory state
			this._customHistoryState = window.history.state ?? [];
			this._onRoute(window.location.pathname);
		};

		window.addEventListener('popstate', handleRoute);

		this._onRoute(document.location.pathname);
	}

	go(pathname: string, withReplace: boolean = false) {
		if (withReplace) {
			this._customHistoryState = dropLast(1, this._customHistoryState);
		}

		this._customHistoryState.push(pathname);

		const changeFunc = (
			!withReplace ? this._history.pushState : this._history.replaceState
		).bind(this._history);

		changeFunc([...this._customHistoryState], '', pathname);
		this._onRoute(pathname);
	}

	forward() {
		this._history.forward();
	}

	back() {
		if (this._customHistoryState.length > 0) {
			this._history.back();
		} else if (this._defaultPathname) {
			this.go(this._defaultPathname);
		}
	}

	getRoute(pathname: string) {
		return this._indexRoutes[pathname] as Route | undefined;
	}

	private _getActiveInstance() {
		return this._currentView?.getContent();
	}
}
