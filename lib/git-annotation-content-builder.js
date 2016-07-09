
'use strict';

const path = require('path');

// TODO: Rename it to GitAnnotationDocumentBuilder
class GitAnnotationContentBuilder {

    constructor(params) {
        this._annotationCssBuilder = params.annotationCssBuilder;
    }

    build(lineBlames, repositoryRootPath) {
        const body = lineBlames.map(lineBlame => this._getHtmlLine(lineBlame, repositoryRootPath)).join('');
        const css = this._annotationCssBuilder.build();
        return `<style>${css}</style><body>${body}</body>`;
    }

    _getHtmlLine(lineBlame, repositoryRootPath) {
        const filePath = path.join(repositoryRootPath, lineBlame.filename);
        const date = new Date(lineBlame.authorTime * 1000);
        return [
            /* eslint-disable indent */
            '<div class="line">',
                '<div class="annotation truncate">',
                    this._getLink(lineBlame.commitHash, filePath), '&nbsp;',
                    `<span>${this._getDateString(date)} ${lineBlame.authorName}</span>`,
                '</div>',
                `<pre>${lineBlame.lineContents}</pre>`,
            '</div>'
            /* eslint-enable indent */
        ].join('');
    }

    _getDateString(date) {
        const pad0 = n => n < 10 ? `0${n}` : n;
        return [date.getFullYear(), date.getMonth() + 1, date.getDate()].map(pad0).join('-');
    }

    _getLink(commitHash, filePath) {
        const args = [filePath, commitHash];
        const encodedCommand = encodeURI(`command:annotation.annotateAt?${JSON.stringify(args)}`);
        if (/^0+$/.test(commitHash)) return '------';
        return `<a href="${encodedCommand}" class="commit-link">${commitHash.slice(0, 6)}</a>`;
    }
}

module.exports = GitAnnotationContentBuilder;
