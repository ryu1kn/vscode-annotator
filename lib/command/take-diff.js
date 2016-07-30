
'use strict';

class TakeDiffCommand {

    constructor(params) {
        this._commands = params.commands;
        this._logger = params.logger;
        this._uriService = params.uriService;
    }

    execute(params) {
        return Promise.resolve().then(() => {
            const paramsBefore = {
                commitHash: params.previousCommitHash,
                path: params.previousPath,
                repositoryRoot: params.repositoryRoot
            };
            const uriBefore = this._getUri(paramsBefore);
            const uriAfter = this._getUri(params);
            const title = this._uriService.getTitle(uriAfter);
            return this._commands.executeCommand('vscode.diff', uriBefore, uriAfter, title);
        }).catch(e => this._logger.error(e.stack));
    }

    _getUri(params) {
        return params.path ? this._uriService.encodeShowFileAction(params) :
                this._uriService.encodeShowEmptyFileAction();
    }

}

module.exports = TakeDiffCommand;
