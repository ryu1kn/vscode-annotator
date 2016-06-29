
'use strict';

class App {
    constructor(params) {
        this._logger = params.logger;
    }

    annotate(editor) {
        return Promise.resolve().then(() => {
        }).catch(e => {
            this._handleError(e);
        });
    }

    _handleError(e) {
        this._logger.error(e.stack);
    }
}

module.exports = App;
