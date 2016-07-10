
'use strict';

const querystring = require('querystring');

class GitAnnotationContentProvider {

    constructor(params) {
        this._annotationData = params.annotationData;
        this._gitAnnotationContentBuilder = params.gitAnnotationContentBuilder;
        this._gitCommand = params.gitCommand;
    }

    provideTextDocumentContent(uri) {
        const repositoryRoot = querystring.parse(uri.query).repositoryRoot;
        console.log('uri', uri);
        if (uri.path === '/display') {
            const lines = this._annotationData.get();
            return this._gitAnnotationContentBuilder.build(lines, repositoryRoot);
        } else {
            const commitHash = querystring.parse(uri.query).commit;
            return this._gitCommand.show(commitHash, uri.path, repositoryRoot);
        }
    }
}

module.exports = GitAnnotationContentProvider;
