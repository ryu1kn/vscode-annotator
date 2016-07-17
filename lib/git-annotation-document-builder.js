
'use strict';

const _ = require('lodash');
const Const = require('./const');

class GitAnnotationDocumentBuilder {

    constructor(params) {
        this._annotationStyleBuilder = params.annotationStyleBuilder;
    }

    build(lineBlames, repositoryRootPath) {
        const digitsCount = String(lineBlames.length).length;
        const safeHtmlBody = lineBlames.map((lineBlame, index) => {
            const paddedLineNumber = _.padStart(index + 1, digitsCount);
            return this._getLineHtml(lineBlame, paddedLineNumber, repositoryRootPath);
        }).join('');
        const safeCss = this._annotationStyleBuilder.build();
        return `<style>${safeCss}</style><body>${safeHtmlBody}</body>`;
    }

    _getLineHtml(lineBlame, paddedLineNumber, repositoryRootPath) {
        const escapedDetails = this._escapeNewLine(_.escape(this._getDetails(lineBlame)));
        return [
            /* eslint-disable indent */
            '<div class="line">',
                `<div class="annotation" data-details="${escapedDetails}">`,
                    this._getAnnotationHtml(lineBlame, paddedLineNumber, repositoryRootPath),
                '</div>',
                `<pre><code>${_.escape(lineBlame.lineContents)}</code></pre>`,
            '</div>'
            /* eslint-enable indent */
        ].join('');
    }

    _escapeNewLine(text) {
        return text.split('\n').join('&#xa;');
    }

    _getDetails(lineBlame) {
        return [
            `Commit: ${lineBlame.commitHash}`,
            `Author: ${lineBlame.authorName}`,
            `Date: ${new Date(lineBlame.authorTime * 1000).toLocaleString()}`,
            '',
            lineBlame.subject
        ].join('\n');
    }

    _getDateString(date) {
        const pad0 = n => n < 10 ? `0${n}` : n;
        return [date.getFullYear(), date.getMonth() + 1, date.getDate()].map(pad0).join('-');
    }

    _getAnnotationHtml(lineBlame, paddedLineNumber, repositoryRootPath) {
        if (/^0+$/.test(lineBlame.commitHash)) {
            return `<div class="annotation-inner">${_.escape(paddedLineNumber)}</div>`;
        }
        const shortCommitHash = lineBlame.commitHash.slice(0, 7);
        const dateString = this._getDateString(new Date(lineBlame.authorTime * 1000));
        const annotation = `${paddedLineNumber}  ${shortCommitHash} ${dateString} ${lineBlame.authorName}`;
        const safeEncodedCommand = this._getUriString(this._getCommandParams(lineBlame, repositoryRootPath));
        return `<a href="${safeEncodedCommand}" class="annotation-inner">${_.escape(annotation)}</a>`;
    }

    _getUriString(commandParams) {
        return encodeURI(`command:${Const.EXTENSION_NAME}.takeDiff?${JSON.stringify([commandParams])}`);
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
}

module.exports = GitAnnotationDocumentBuilder;
