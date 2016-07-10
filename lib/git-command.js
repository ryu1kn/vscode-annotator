
'use strict';

const path = require('path');

class GitCommand {

    constructor(params) {
        this._shellCommandRunner = params.shellCommandRunner;
    }

    blame(filePath, repositoryRoot) {
        const options = {cwd: repositoryRoot};
        const args = ['blame', '--line-porcelain', '--', filePath];
        return this._shellCommandRunner.run('git', args, options);
    }

    show(commit, filePath, repositoryRoot) {
        const options = {cwd: repositoryRoot};
        return this._shellCommandRunner.run('git', ['show', `${commit}:${filePath}`], options);
    }

    getRepositoryRoot(filePath) {
        const options = {cwd: path.dirname(filePath)};
        return this._shellCommandRunner.run('git', ['rev-parse', '--show-toplevel'], options);
    }
}

module.exports = GitCommand;
