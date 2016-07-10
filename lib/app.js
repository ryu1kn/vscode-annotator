
'use strict';

const Const = require('./const');
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
            .then(() => this._gitAnnotationLoader.load(editor.document.uri.path))
            .then(result => this._displayAnnotation(result.lines, result.repositoryRootPath))
            .catch(e => this._handleError(e));
    }

    takeDiff(lineBlame, repositoryRoot) {
        return Promise.resolve().then(() => {
            const uriBefore = this._getUri(
                lineBlame.previousCommitHash, lineBlame.previousFilename, repositoryRoot
            );
            const uriAfter = this._getUri(lineBlame.commitHash, lineBlame.filename, repositoryRoot);
            return this._vscode.commands.executeCommand('vscode.diff', uriBefore, uriAfter);
        }).catch(e => this._handleError(e));
    }

    _getUri(commitHash, filePath, repositoryRoot) {
        const qs = querystring.stringify({
            commit: commitHash,
            repositoryRoot
        });
        return this._vscode.Uri.parse(`${Const.EXTENSION_NAME}:/file/${filePath}?${qs}`);
    }

    _displayAnnotation(blameLines, repositoryRoot) {
        this._annotationData.set(blameLines);
        const qs = querystring.stringify({
            repositoryRoot,
            _ts: Date.now()
        });
        const uri = this._vscode.Uri.parse(`${Const.EXTENSION_NAME}:/annotation?${qs}`);
        return this._vscode.commands.executeCommand('vscode.previewHtml', uri);
    }

    _handleError(e) {
        this._logger.error(e.stack);
    }
}

module.exports = App;
