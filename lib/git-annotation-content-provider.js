
'use strict';

const querystring = require('querystring');

class GitAnnotationContentProvider {

    constructor(params) {
        this._annotationData = params.annotationData;
        this._gitAnnotationContentBuilder = params.gitAnnotationContentBuilder;
    }

    provideTextDocumentContent(uri) {
        const repositoryRoot = querystring.parse(uri.query).repositoryRoot;
        const lines = this._annotationData.get();
        return this._gitAnnotationContentBuilder.build(lines, repositoryRoot);
    }
}

module.exports = GitAnnotationContentProvider;
