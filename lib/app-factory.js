
'use strict';

const App = require('./app');

class AppFactory {

    create(vscode, logger) {
        return new App({
            logger
        });
    }

}

module.exports = AppFactory;
