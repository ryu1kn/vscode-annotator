'use strict';

const GitAnnotationLineValues = require('./git-annotation-line-values');

class GitAnnotationLineDirector {

    constructor(builder) {
        this._builder = builder;
    }

    construct(params) {
        const line = new GitAnnotationLineValues({
            lineBlame: params.lineBlame,
            lineNumber: params.lineNumber,
            lineNumberWidth: params.lineNumberWidth,
            repositoryRoot: params.repositoryRoot
        });
        this._builder.addDetails(line.details);
        this._builder.addCommand(line.command);
        this._builder.addCaption(line.caption);
        this._builder.addCommitHash(line.commitHash);
        this._builder.addLineContents(line.lineContents);
        return this._builder.getHtml();
    }
}

module.exports = GitAnnotationLineDirector;
