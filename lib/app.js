
'use strict';

const Const = require('./const');
const querystring = require('querystring');

class App {

    constructor(params) {
        this._Uri = params.Uri;
        this._annotationData = params.annotationData;
        this._commands = params.commands;
        this._getCurrentDate = params.getCurrentDateFn;
        this._gitAnnotationLoader = params.gitAnnotationLoader;
        this._logger = params.logger;
    }

    annotate(editor) {
        return Promise.resolve()
            .then(() => this._gitAnnotationLoader.load(editor.document.uri.path))
            .then(result => {
                this._annotationData.set(result.lines);
                const qs = querystring.stringify({
                    repositoryRoot: result.repositoryRootPath,
                    _ts: this._getCurrentDate()
                });
                const uri = this._Uri.parse(`${Const.EXTENSION_NAME}:/annotation?${qs}`);
                const title = `${Const.EXTENSION_NAME}: ${editor.document.fileName}`;
                return this._commands.executeCommand('vscode.previewHtml', uri, undefined, title);
            })
            .catch(e => this._handleError(e));
    }

    takeDiff(lineBlame, repositoryRoot) {
        return Promise.resolve().then(() => {
            const uriBefore = this._getUri(lineBlame.previousCommitHash, lineBlame.previousFilename, repositoryRoot);   // eslint-disable-line max-len
            const uriAfter = this._getUri(lineBlame.commitHash, lineBlame.filename, repositoryRoot);
            return this._commands.executeCommand('vscode.diff', uriBefore, uriAfter);
        }).catch(e => this._handleError(e));
    }

    _getUri(commitHash, filePath, repositoryRoot) {
        const qs = querystring.stringify({
            commit: commitHash,
            repositoryRoot
        });
        return this._Uri.parse(`${Const.EXTENSION_NAME}:/file/${filePath}?${qs}`);
    }

    _handleError(e) {
        this._logger.error(e.stack);
    }
}

module.exports = App;
