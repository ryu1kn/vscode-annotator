
'use strict';

const path = require('path');

class GitAnnotationContentBuilder {

    build(lineInfos, repositoryRootPath) {
        const body = lineInfos.map(lineBlame => this._getHtmlLine(lineBlame, repositoryRootPath)).join('');
        return `<style>${this._getStyle()}</style><body>${body}</body>`;
    }

    _getStyle() {
        const fontFamily = 'Monaco';
        const fontSize = '14px';
        const lineHeight = 1.7;
        const annotationColumnWidth = '15em';
        return `
            * {
                font-family: ${fontFamily};
                font-size: ${fontSize};
                line-height: ${lineHeight};
                margin: 0;
            }
            .line {
                display: -webkit-flex;
                display: flex;
                -webkit-flex-wrap: nowrap;
                flex-wrap: nowrap;
            }
            .annotation {
                min-width: ${annotationColumnWidth};
                max-width: ${annotationColumnWidth};
                color: gray;
                margin-right: 1em;
            }
            .truncate {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }`;
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
        const encodedCommand = encodeURI(`command:annotation.showAt?${JSON.stringify(args)}`);
        const shortCommit = commit.slice(0, 6);
        if (/^0+$/.test(commit)) return `${shortCommit}`;
        return `<a href="${encodedCommand}" class="commit-link">${shortCommit}</a>`;
    }
}

module.exports = GitAnnotationContentBuilder;
