
'use strict';

const GitAnnotationContentBuilder = require('./git-annotation-content-builder');
const querystring = require('querystring');

class GitAnnotationContentProvider {
    constructor(params) {
        this._gitAnnotationContentBuilder = new GitAnnotationContentBuilder();
        this._annotationData = params.annotationData;
    }

    provideTextDocumentContent(uri) {
        const repositoryRoot = querystring.parse(uri.query).repositoryRoot;
        const lines = this._annotationData.get();
        return this._gitAnnotationContentBuilder.build(lines, repositoryRoot);
    }
}

module.exports = GitAnnotationContentProvider;
