
'use strict';

const path = require('path');

// TODO: Rename it to GitAnnotationDocumentBuilder
class GitAnnotationContentBuilder {

    constructor(params) {
        this._annotationCssBuilder = params.annotationCssBuilder;
    }

    build(lineInfos, repositoryRootPath) {
        const body = lineInfos.map(lineBlame => this._getHtmlLine(lineBlame, repositoryRootPath)).join('');
        const css = this._annotationCssBuilder.build();
        return `<style>${css}</style><body>${body}</body>`;
    }

    _getHtmlLine(lineBlame, repositoryRootPath) {
        const filePath = path.join(repositoryRootPath, lineBlame.filename);
        const date = new Date(lineBlame['author-time'] * 1000);
        return [
            /* eslint-disable indent */
            '<div class="line">',
                '<div class="annotation truncate">',
                    this._getLink(lineBlame.commit, filePath), '&nbsp;',
                    `<span>${this._getDateString(date)} ${lineBlame.author}</span>`,
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

    _getLink(commit, filePath) {
        const args = [filePath, commit];
        const encodedCommand = encodeURI(`command:annotation.annotateAt?${JSON.stringify(args)}`);
        const shortCommit = commit.slice(0, 6);
        if (/^0+$/.test(commit)) return `${shortCommit}`;
        return `<a href="${encodedCommand}" class="commit-link">${shortCommit}</a>`;
    }
}

module.exports = GitAnnotationContentBuilder;
