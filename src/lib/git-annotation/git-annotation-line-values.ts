
const _padStart = require('lodash.padstart');
const _reduce = require('lodash.reduce');
import * as Const from '../const';
const multiline = require('multiline-string')();

export class GitAnnotationLineValues {
    private _lineBlameData: any;
    private _lineNumber: any;
    private _lineNumberWidth: any;
    private _repositoryRoot: any;
    private _formatDateTime: any;

    constructor(params) {
        this._lineBlameData = params.lineBlame;
        this._lineNumber = params.lineNumber;
        this._lineNumberWidth = params.lineNumberWidth;
        this._repositoryRoot = params.repositoryRoot;
        this._formatDateTime = params.formatDateTime;
    }

    get isCommitted() {
        return !/^0+$/.test(this._lineBlameData.commitHash);
    }

    get details() {
        const blame = this._lineBlameData;
        return multiline(`
            Commit: ${blame.commitHash}
            Author: ${blame.authorName}
            Date: ${this._formatDateTime(new Date(blame.authorTime * 1000))}

            ${blame.subject}`);
    }

    get caption() {
        const paddedLineNumber = _padStart(this._lineNumber, this._lineNumberWidth);
        if (!this.isCommitted) return paddedLineNumber;

        const lineBlame = this._lineBlameData;
        const dateString = this._getDateString(new Date(lineBlame.authorTime * 1000));
        return `${paddedLineNumber}  ${dateString} ${lineBlame.authorName}`;
    }

    get lineContents() {
        return this._lineBlameData.lineContents;
    }

    get command() {
        if (!this.isCommitted) return null;
        return {
            name: `${Const.EXTENSION_NAME}.takeDiff`,
            args: [this._getCommandParams(this._lineBlameData, this._repositoryRoot)]
        };
    }

    get commitHash() {
        return this._lineBlameData.commitHash;
    }

    _getCommandParams(lineBlame, repositoryRoot) {
        const pickKeys = ['commitHash', 'filename', 'previousCommitHash', 'previousFilename'];
        const substituteKeys = {
            filename: 'path',
            previousFilename: 'previousPath'
        };
        return _reduce(lineBlame, (memo, value, key) => {
            if (!pickKeys.includes(key)) return memo;

            const newKey = substituteKeys[key] || key;
            return Object.assign(memo, {[newKey]: value});
        }, {repositoryRoot});
    }

    _getDateString(date) {
        const pad0 = n => n < 10 ? `0${n}` : n;
        return [date.getFullYear(), date.getMonth() + 1, date.getDate()].map(pad0).join('-');
    }

}
