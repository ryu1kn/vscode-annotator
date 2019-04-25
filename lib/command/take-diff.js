
const _pickBy = require('lodash.pickby');

class TakeDiffCommand {

    constructor(params) {
        this._commands = params.commands;
        this._logger = params.logger;
        this._uriService = params.uriService;
        this._editorTitleResolver = params.editorTitleResolver;
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
            const title = this._editorTitleResolver.resolve(uriAfter);
            return this._commands.executeCommand('vscode.diff', uriBefore, uriAfter, title);
        }).catch(e => this._logger.error(e.stack));
    }

}

function dropFalsyValues(object) {
    return _pickBy(object, v => v);
}

module.exports = TakeDiffCommand;
