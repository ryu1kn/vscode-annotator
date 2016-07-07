
'use strict';

const path = require('path');

class GitCommand {

    constructor(params) {
        this._shellCommandRunner = params.shellCommandRunner;
    }

    blame(filePath, commit) {
        const options = {cwd: path.dirname(filePath)};
        const args = commit ? ['blame', '--line-porcelain', commit, '--', filePath] :
                              ['blame', '--line-porcelain', '--', filePath];
        return this._shellCommandRunner.run('git', args, options);
    }

    getRepositoryRoot(filePath) {
        const options = {cwd: path.dirname(filePath)};
        return this._shellCommandRunner.run('git', ['rev-parse', '--show-toplevel'], options);
    }
}

module.exports = GitCommand;
