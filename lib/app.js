
'use strict';

class App {

    constructor(params) {
        this._annotationData = params.annotationData;
        this._commands = params.commands;
        this._gitAnnotationLoader = params.gitAnnotationLoader;
        this._logger = params.logger;
        this._uriService = params.uriService;
    }

    annotate(editor) {
        return Promise.resolve()
            .then(() => this._gitAnnotationLoader.load(editor.document.uri.fsPath))
            .then(result => {
                this._annotationData.set(result.lines);
                const params = {
                    path: editor.document.uri.fsPath,
                    repositoryRoot: result.repositoryRootPath
                };
                const uri = this._uriService.encodeAnnotateFileAction(params);
                const title = `annotation: ${editor.document.fileName}`;
                return this._commands.executeCommand('vscode.previewHtml', uri, undefined, title);
            })
            .catch(e => this._handleError(e));
    }

    takeDiff(lineBlame, repositoryRoot) {
        return Promise.resolve().then(() => {
            const uriBefore = this._getUri(lineBlame.previousCommitHash, lineBlame.previousFilename, repositoryRoot);   // eslint-disable-line max-len
            const uriAfter = this._getUri(lineBlame.commitHash, lineBlame.filename, repositoryRoot);
            const title = `${lineBlame.filename}@${lineBlame.commitHash}`;
            return this._commands.executeCommand('vscode.diff', uriBefore, uriAfter, title);
        }).catch(e => this._handleError(e));
    }

    _getUri(commitHash, path, repositoryRoot) {
        return path ? this._uriService.encodeShowFileAction({path, commitHash, repositoryRoot}) :
                      this._uriService.encodeShowEmptyFileAction();
    }

    _handleError(e) {
        this._logger.error(e.stack);
    }
}

module.exports = App;
