
'use strict';

const querystring = require('querystring');

class GitAnnotationContentProvider {

    constructor(params) {
        this._annotationData = params.annotationData;
        this._gitAnnotationContentBuilder = params.gitAnnotationContentBuilder;
        this._gitCommand = params.gitCommand;
    }

    provideTextDocumentContent(uri) {
        return uri.path === '/annotation' ? this._getAnnotationContents(uri) : this._getFileContents(uri);
    }

    _getAnnotationContents(uri) {
        const lines = this._annotationData.get();
        return this._gitAnnotationContentBuilder.build(lines, this._getRepositoryRoot(uri));
    }

    _getFileContents(uri) {
        const path = uri.path.replace('/file/', '');
        const commitHash = querystring.parse(uri.query).commit;
        return this._gitCommand.show(commitHash, path, this._getRepositoryRoot(uri));
    }

    _getRepositoryRoot(uri) {
        return querystring.parse(uri.query).repositoryRoot;
    }
}

module.exports = GitAnnotationContentProvider;
