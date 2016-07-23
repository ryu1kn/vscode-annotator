
'use strict';

const App = require('./app');

class AppFactory {

    create(params) {
        return new App({
            commands: params.vscode.commands,
            logger: params.logger,
            uriService: params.uriService
        });
    }

}

module.exports = AppFactory;
