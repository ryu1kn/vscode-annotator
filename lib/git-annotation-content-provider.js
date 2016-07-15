
'use strict';

const querystring = require('querystring');

class GitAnnotationContentProvider {

    constructor(params) {
        this._annotationData = params.annotationData;
        this._gitAnnotationDocumentBuilder = params.gitAnnotationDocumentBuilder;
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
        const lines = this._annotationData.get();
        const repositoryRoot = querystring.parse(uri.query).repositoryRoot;
        return this._gitAnnotationDocumentBuilder.build(lines, repositoryRoot);
    }

    _getFileContents(uri) {
        const params = querystring.parse(uri.query);
        return this._gitCommand.show(params.commitHash, params.path, params.repositoryRoot);
    }
}

module.exports = GitAnnotationContentProvider;
