
'use strict';

class GitAnnotationLoader {

    constructor(params) {
        this._gitCommand = params.gitCommand;
        this._gitBlameOutputParser = params.gitBlameOutputParser;
    }

    load(path, commitHash) {
        const commands = [
            this._gitCommand.blame(path, commitHash),
            this._gitCommand.getRepositoryRoot(path)
        ];
        return Promise.all(commands).then(result => {
            return {
                lines: this._gitBlameOutputParser.parse(result[0]),
                repositoryRootPath: result[1].trim()
            };
        });
    }
}

module.exports = GitAnnotationLoader;
