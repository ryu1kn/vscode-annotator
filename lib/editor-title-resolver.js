
const Const = require('./const');
const path = require('path');
const querystring = require('querystring');

class EditorTitleResolver {

    constructor(params) {
        this._workspaceRoot = params.workspaceRoot;
    }

    resolve(uri) {
        const queryObj = querystring.parse(uri.query);
        const displayPath = queryObj.path || queryObj.previousPath;
        const filePath = this._getPathFromWorkspace(
            displayPath, queryObj.repositoryRoot, this._workspaceRoot
        );
        return [
            path.basename(filePath),
            this._getCommitSuffix(queryObj.commitHash),
            this._getDirectorySuffix(filePath)
        ].join('');
    }

    _getCommitSuffix(commitHash) {
        return commitHash ? `@${commitHash.slice(0, Const.GIT_COMMIT_HASH_SHORT_LENGTH)}` : '';
    }

    _getDirectorySuffix(filePath) {
        const dirPath = path.dirname(filePath);
        return dirPath !== '.' ? ` \u2013 ${dirPath}` : '';
    }

    _getPathFromWorkspace(filePath, repositoryPath, workspaceRoot) {
        const absFilePath = repositoryPath ? path.resolve(repositoryPath, filePath) : filePath;
        if (!workspaceRoot) return absFilePath;

        let fileFromWorkspace = path.relative(workspaceRoot, absFilePath);
        let isOutOfWorkspace = fileFromWorkspace.startsWith('..');
        return isOutOfWorkspace ? absFilePath : fileFromWorkspace;
    }

}

module.exports = EditorTitleResolver;
