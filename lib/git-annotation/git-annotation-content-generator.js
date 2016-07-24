
'use strict';

class GitAnnotationContentGenerator {

    constructor(params) {
        this._gitCommand = params.gitCommand;
        this._gitAnnotationHtmlDirectorFactory = params.gitAnnotationHtmlDirectorFactory;
        this._gitBlameOutputParser = params.gitBlameOutputParser;
    }

    generate(params) {
        return this._getRepositoryRoot(params).then(repositoryRoot => {
            return this._gitCommand.blame(params.path, params.commitHash, repositoryRoot)
                .then(output => this._gitBlameOutputParser.parse(output))
                .then(blameLines => {
                    const gitAnnotationHtmlDirector = this._gitAnnotationHtmlDirectorFactory.create();
                    return gitAnnotationHtmlDirector.construct(blameLines, repositoryRoot);
                });
        });
    }

    _getRepositoryRoot(params) {
        if (params.repositoryRoot) return Promise.resolve(params.repositoryRoot);
        return this._gitCommand.getRepositoryRoot(params.path)
            .then(repositoryRoot => repositoryRoot.trim());
    }
}

module.exports = GitAnnotationContentGenerator;
