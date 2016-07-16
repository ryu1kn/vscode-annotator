
'use strict';

const querystring = require('querystring');

class GitContentProvider {

    constructor(params) {
        this._gitAnnotationDocumentBuilder = params.gitAnnotationDocumentBuilder;
        this._gitAnnotationLoader = params.gitAnnotationLoader;
        this._gitCommand = params.gitCommand;
    }

    provideTextDocumentContent(uri) {
        const action = uri.path;
        switch (action) {
        case 'annotate-file':
            return this._getAnnotationContents(uri);
        case 'show-file':
            return this._getFileContents(uri);
        case 'show-emptyfile':
            return '';
        default:
            throw new Error('Unknown action');
        }
    }

    _getAnnotationContents(uri) {
        const params = querystring.parse(uri.query);
        return this._gitAnnotationLoader.load(params.path).then(
            result => this._gitAnnotationDocumentBuilder.build(result.lines, result.repositoryRootPath)
        );
    }

    _getFileContents(uri) {
        const params = querystring.parse(uri.query);
        return this._gitCommand.show(params.commitHash, params.path, params.repositoryRoot);
    }
}

module.exports = GitContentProvider;
