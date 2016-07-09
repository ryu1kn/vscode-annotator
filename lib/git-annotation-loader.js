
'use strict';

class GitAnnotationLoader {

    constructor(params) {
        this._gitCommand = params.gitCommand;
        this._gitBlameOutputParser = params.gitBlameOutputParser;
    }

    loadHead(path) {
        return this._gitCommand.getRepositoryRoot(path).then(repositoryRootPath => {
            const root = repositoryRootPath.trim();
            return this.loadAt('HEAD', path, root).then(blameLines => {
                return {
                    lines: blameLines,
                    repositoryRootPath: root
                };
            });
        });
    }

    loadAt(commitHash, path, repositoryRoot) {
        return this._gitCommand.blame(path, commitHash, repositoryRoot)
            .then(output => this._gitBlameOutputParser.parse(output));
    }
}

module.exports = GitAnnotationLoader;
