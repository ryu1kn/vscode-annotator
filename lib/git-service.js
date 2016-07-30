
'use strict';

const path = require('path');

class GitService {

    constructor(params) {
        this._shellCommandRunner = params.shellCommandRunner;
        this._gitBlameOutputParser = params.gitBlameOutputParser;
        this._changedFileListParser = params.changedFileListParser;
    }

    getBlame(filePath, commitHash, repositoryRoot) {
        const options = {cwd: repositoryRoot};
        const args = commitHash ?
            ['blame', '--line-porcelain', commitHash, '--', filePath] :
            ['blame', '--line-porcelain', '--', filePath];
        return this._shellCommandRunner.run('git', args, options)
            .then(output => this._gitBlameOutputParser.parse(output));
    }

    getChangedFilesInCommit(commitHash, repositoryRoot) {
        const options = {cwd: repositoryRoot};
        const args = ['diff-tree', commitHash, '--name-status', '--no-commit-id', '-M', '-r'];
        return this._shellCommandRunner.run('git', args, options)
            .then(output => this._changedFileListParser.parse(output));
    }

    getFileContents(commit, filePath, repositoryRoot) {
        const options = {cwd: repositoryRoot};
        return this._shellCommandRunner.run('git', ['show', `${commit}:${filePath}`], options);
    }

    getRepositoryRoot(filePath) {
        const options = {cwd: path.dirname(filePath)};
        return this._shellCommandRunner.run('git', ['rev-parse', '--show-toplevel'], options)
            .then(repositoryRoot => repositoryRoot.trim());
    }
}

module.exports = GitService;
