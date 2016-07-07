
'use strict';

const querystring = require('querystring');

class App {
    constructor(params) {
        this._vscode = params.vscode;   // TODO: move this out
        this._logger = params.logger;
        this._gitAnnotationLoader = params.gitAnnotationLoader;
        this._annotationData = params.annotationData;
    }

    annotate(editor) {
        return this._displayAnnotation(editor.document.uri.path)
            .catch(e => this._handleError(e));
    }

    showAt(filePath, commit) {
        return this._displayAnnotation(filePath, commit)
            .catch(e => this._handleError(e));
    }

    _displayAnnotation(filePath, commit) {
        return Promise.resolve()
            .then(() => this._gitAnnotationLoader.load(filePath, commit))
            .then(result => {
                this._annotationData.set(result.lines);
                const qs = querystring.stringify({
                    _ts: Date.now(),
                    repositoryRoot: result.repositoryRootPath
                });
                const uri = this._vscode.Uri.parse(`annotation:/display?${qs}`);
                return this._vscode.commands.executeCommand('vscode.previewHtml', uri);
            });
    }

    _handleError(e) {
        this._logger.error(e.stack);
    }
}

module.exports = App;
