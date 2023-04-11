const fs = require('fs');
const { JSDOM } = require('jsdom');

const { window } = new JSDOM('<div id="app"></div>', {
	url: 'http://localhost:3000'
});

global.window = window;
global.document = window.document;
global.DocumentFragment = window.DocumentFragment;
global.createElement = window.createElement;
global.history = window.history;

require.extensions['.hbs'] = function (module, filename) {
	const tmp = fs.readFileSync(filename, 'utf-8');
	module.exports = tmp;
};

require.extensions['.scss'] = function () {
	module.exports = () => ({});
};
