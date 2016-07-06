
'use strict';

const GitCommand = require('./git-command');
const GitAnnotationContentBuilder = require('./git-annotation-content-builder');
const GitBlameOutputParser = require('./git-blame-output-parser');

class GitAnnotationContentProvider {
    constructor(params) {
        this._gitCommand = new GitCommand();
        this._gitAnnotationContentBuilder = new GitAnnotationContentBuilder();
        this._gitBlameOutputParser = new GitBlameOutputParser();
    }

    provideTextDocumentContent(uri) {
        return Promise.all([this._gitCommand.blame(uri), this._gitCommand.getRepositoryRoot(uri)])
            .then(result => {
                const lineInfos = this._gitBlameOutputParser.parse(result[0]);
                const repositoryRootPath = result[1].trim();
                return this._gitAnnotationContentBuilder.build(lineInfos, repositoryRootPath);
            });
    }
}

module.exports = GitAnnotationContentProvider;
