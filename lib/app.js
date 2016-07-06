
'use strict';

class App {
    constructor(params) {
        this._vscode = params.vscode;   // TODO: move this out
        this._logger = params.logger;
    }

    annotate(editor) {
        return Promise.resolve().then(() => {
            const documentPath = editor.document.uri.path;
            const annotationUri = this._vscode.Uri.parse(`annotation:${documentPath}?_ts=${Date.now()}`);
            return this._vscode.commands.executeCommand('vscode.previewHtml', annotationUri, editor.viewColumn);
        }).catch(e => {
            this._handleError(e);
        });
    }

    showAt(filePath, commit) {
        const annotationUri = this._vscode.Uri.parse(`annotation:${filePath}?commit=${commit}&_ts=${Date.now()}`);
        return this._vscode.commands.executeCommand('vscode.previewHtml', annotationUri);
    }

    _handleError(e) {
        this._logger.error(e.stack);
    }
}

module.exports = App;
