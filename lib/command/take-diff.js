
'use strict';

const _ = require('lodash');

class TakeDiffCommand {

    constructor(params) {
        this._commands = params.commands;
        this._logger = params.logger;
        this._uriService = params.uriService;
    }

    execute(params) {
        return Promise.resolve().then(() => {
            const paramsBefore = dropFalsyValues({
                commitHash: params.previousCommitHash,
                path: params.previousPath,
                repositoryRoot: params.repositoryRoot
            });
            const uriBefore = this._uriService.encodeShowFileAction(paramsBefore);
            const uriAfter = this._uriService.encodeShowFileAction(params);
            const title = this._uriService.getTitle(uriAfter);
            return this._commands.executeCommand('vscode.diff', uriBefore, uriAfter, title);
        }).catch(e => this._logger.error(e.stack));
    }

}

function dropFalsyValues(object) {
    return _.pickBy(object, _.identity);
}

module.exports = TakeDiffCommand;
