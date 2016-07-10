
'use strict';

class GitAnnotationLoader {

    constructor(params) {
        this._gitCommand = params.gitCommand;
        this._gitBlameOutputParser = params.gitBlameOutputParser;
    }

    load(path) {
        return this._gitCommand.getRepositoryRoot(path).then(repositoryRootPath => {
            const root = repositoryRootPath.trim();
            return this._gitCommand.blame(path, root)
                .then(output => this._gitBlameOutputParser.parse(output))
                .then(blameLines => ({
                    lines: blameLines,
                    repositoryRootPath: root
                }));
        });
    }
}

module.exports = GitAnnotationLoader;
