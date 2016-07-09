
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
        return Promise.resolve()
            .then(() => this._gitAnnotationLoader.loadHead(editor.document.uri.path))
            .then(result => this._displayAnnotation(result.lines, result.repositoryRootPath))
            .catch(e => this._handleError(e));
    }

    annotateAt(commit, filePath, repositoryRoot) {
        return Promise.resolve()
            .then(() => this._gitAnnotationLoader.loadAt(commit, filePath, repositoryRoot))
            .then(blameLines => this._displayAnnotation(blameLines, repositoryRoot))
            .catch(e => this._handleError(e));
    }

    _displayAnnotation(blameLines, repositoryRoot) {
        this._annotationData.set(blameLines);
        const qs = querystring.stringify({
            repositoryRoot,
            _ts: Date.now()
        });
        const uri = this._vscode.Uri.parse(`annotation:/display?${qs}`);
        return this._vscode.commands.executeCommand('vscode.previewHtml', uri);
    }

    _handleError(e) {
        this._logger.error(e.stack);
    }
}

module.exports = App;
