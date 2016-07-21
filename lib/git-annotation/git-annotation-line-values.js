
'use strict';

const _ = require('lodash');
const Const = require('../const');

class GitAnnotationLineValues {

    constructor(params) {
        this._lineBlameData = params.lineBlame;
        this._lineNumber = params.lineNumber;
        this._lineNumberWidth = params.lineNumberWidth;
        this._repositoryRoot = params.repositoryRoot;
    }

    get isCommitted() {
        return !/^0+$/.test(this._lineBlameData.commitHash);
    }

    get details() {
        const blame = this._lineBlameData;
        return [
            `Commit: ${blame.commitHash}`,
            `Author: ${blame.authorName}`,
            `Date: ${new Date(blame.authorTime * 1000).toLocaleString()}`,
            '',
            blame.subject
        ].join('\n');
    }

    get caption() {
        const paddedLineNumber = _.padStart(this._lineNumber, this._lineNumberWidth);
        if (!this.isCommitted) return paddedLineNumber;

        const lineBlame = this._lineBlameData;
        const shortCommitHash = lineBlame.commitHash.slice(0, Const.GIT_COMMIT_HASH_SHORT_LENGTH);
        const dateString = this._getDateString(new Date(lineBlame.authorTime * 1000));
        return `${paddedLineNumber}  ${shortCommitHash} ${dateString} ${lineBlame.authorName}`;
    }

    get lineContents() {
        return this._lineBlameData.lineContents;
    }

    get command() {
        return {
            name: `${Const.EXTENSION_NAME}.takeDiff`,
            args: [this._getCommandParams(this._lineBlameData, this._repositoryRoot)]
        };
    }

    _getCommandParams(lineBlame, repositoryRoot) {
        const pickKeys = ['commitHash', 'filename', 'previousCommitHash', 'previousFilename'];
        const substituteKeys = {
            filename: 'path',
            previousFilename: 'previousPath'
        };
        return _.reduce(lineBlame, (memo, value, key) => {
            if (!_.includes(pickKeys, key)) return memo;

            const newKey = substituteKeys[key] || key;
            return Object.assign(memo, {[newKey]: value});
        }, {repositoryRoot});
    }

    _getDateString(date) {
        const pad0 = n => n < 10 ? `0${n}` : n;
        return [date.getFullYear(), date.getMonth() + 1, date.getDate()].map(pad0).join('-');
    }
}

module.exports = GitAnnotationLineValues;
