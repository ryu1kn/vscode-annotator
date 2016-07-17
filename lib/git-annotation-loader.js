
'use strict';

// TODO: Rename to GitAnnotationDocumentDirector
class GitAnnotationLoader {

    constructor(params) {
        this._gitCommand = params.gitCommand;
        this._gitAnnotationDocumentBuilder = params.gitAnnotationDocumentBuilder;
        this._gitBlameOutputParser = params.gitBlameOutputParser;
    }

    load(params) {
        return this._getRepositoryRoot(params).then(repositoryRoot => {
            return this._gitCommand.blame(params.path, params.commitHash, repositoryRoot)
                .then(output => this._gitBlameOutputParser.parse(output))
                .then(blameLines => {
                    return this._gitAnnotationDocumentBuilder.build(blameLines, repositoryRoot);
                });
        });
    }

    _getRepositoryRoot(params) {
        if (params.repositoryRoot) return Promise.resolve(params.repositoryRoot);
        return this._gitCommand.getRepositoryRoot(params.path)
            .then(repositoryRoot => repositoryRoot.trim());
    }
}

module.exports = GitAnnotationLoader;
