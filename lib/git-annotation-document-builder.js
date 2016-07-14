
'use strict';

const _ = require('lodash');
const Const = require('./const');

class GitAnnotationDocumentBuilder {

    constructor(params) {
        this._annotationStyleBuilder = params.annotationStyleBuilder;
    }

    build(lineBlames, repositoryRootPath) {
        const digitsCount = String(lineBlames.length).length;
        const htmlBody = lineBlames.map((lineBlame, index) => {
            const paddedLineNumber = _.padStart(index + 1, digitsCount);
            return this._getLineHtml(lineBlame, paddedLineNumber, repositoryRootPath);
        }).join('');
        const css = this._annotationStyleBuilder.build();
        return `<style>${css}</style><body>${htmlBody}</body>`;
    }

    _getLineHtml(lineBlame, paddedLineNumber, repositoryRootPath) {
        const details = this._escapeNewLine(_.escape(this._getDetails(lineBlame)));
        return [
            /* eslint-disable indent */
            '<div class="line">',
                `<div class="annotation" data-details="${details}">`,
                    this._getAnnotationHtml(lineBlame, paddedLineNumber, repositoryRootPath),
                '</div>',
                `<pre>${this._escapePreTagContents(lineBlame.lineContents)}</pre>`,
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

    _escapePreTagContents(text) {
        return text.split('<').join('&lt;');
    }

    _getDateString(date) {
        const pad0 = n => n < 10 ? `0${n}` : n;
        return [date.getFullYear(), date.getMonth() + 1, date.getDate()].map(pad0).join('-');
    }

    _getAnnotationHtml(lineBlame, paddedLineNumber, repositoryRootPath) {
        if (/^0+$/.test(lineBlame.commitHash)) {
            return `<div class="annotation-inner">${paddedLineNumber}</div>`;
        }
        const shortCommitHash = lineBlame.commitHash.slice(0, 7);
        const dateString = this._getDateString(new Date(lineBlame.authorTime * 1000));
        const annotation = `${paddedLineNumber}  ${shortCommitHash} ${dateString} ${lineBlame.authorName}`;
        const encodedCommand = this._getUriString(lineBlame, repositoryRootPath);
        return `<a href="${encodedCommand}" class="annotation-inner">${_.escape(annotation)}</a>`;
    }

    _getUriString(lineBlame, repositoryRootPath) {
        const embedBlameInfo = _.pick(lineBlame, [
            'commitHash', 'filename', 'previousCommitHash', 'previousFilename'
        ]);
        const args = [embedBlameInfo, repositoryRootPath];
        return encodeURI(`command:${Const.EXTENSION_NAME}.takeDiff?${JSON.stringify(args)}`);
    }
}

module.exports = GitAnnotationDocumentBuilder;
