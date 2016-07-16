
'use strict';

const App = require('./app');
const UriService = require('./uri-service');

class AppFactory {

    create(params) {
        const commands = params.vscode.commands;
        const logger = params.logger;
        const uriService = new UriService({
            Uri: params.vscode.Uri,
            getCurrentDateFn: () => Date.now()
        });
        return new App({logger, commands, uriService});
    }

}

module.exports = AppFactory;
