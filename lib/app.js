
'use strict';

class App {

    constructor(params) {
        this._commands = params.commands;
        this._logger = params.logger;
        this._uriService = params.uriService;
    }

    annotate(editor) {
        return Promise.resolve().then(() => {
            const uri = this._uriService.convertToAnnotateFileAction(editor.document.uri);
            const title = `annotation: ${editor.document.fileName}`;
            return this._commands.executeCommand('vscode.previewHtml', uri, undefined, title);
        }).catch(e => this._handleError(e));
    }

    takeDiff(params) {
        return Promise.resolve().then(() => {
            const paramsBefore = {
                commitHash: params.previousCommitHash,
                path: params.previousPath,
                repositoryRoot: params.repositoryRoot
            };
            const uriBefore = this._getUri(paramsBefore);
            const uriAfter = this._getUri(params);
            const title = `${params.path}@${params.commitHash}`;
            return this._commands.executeCommand('vscode.diff', uriBefore, uriAfter, title);
        }).catch(e => this._handleError(e));
    }

    _getUri(params) {
        return params.path ? this._uriService.encodeShowFileAction(params) :
                this._uriService.encodeShowEmptyFileAction();
    }

    _handleError(e) {
        this._logger.error(e.stack);
    }
}

module.exports = App;
