
'use strict';

const _ = require('lodash');
const GitAnnotationLine = require('./git-annotation-line');

class GitAnnotationDocumentBuilder {

    constructor(params) {
        this._annotationStyleBuilder = params.annotationStyleBuilder;
    }

    build(lineBlames, repositoryRootPath) {
        const digitsCount = String(lineBlames.length).length;
        const safeHtmlBody = lineBlames.map((lineBlame, index) => {
            const annotationLine = new GitAnnotationLine({
                lineData: lineBlame,
                lineNumber: index + 1,
                lineNumberWidth: digitsCount,
                repositoryRoot: repositoryRootPath
            });
            return this._getLineHtml(annotationLine);
        }).join('');
        const safeCss = this._annotationStyleBuilder.build();
        return `<style>${safeCss}</style><body>${safeHtmlBody}</body>`;
    }

    _getLineHtml(annotationLine) {
        const escapedDetails = this._escapeNewLine(_.escape(annotationLine.details));
        return [
            /* eslint-disable indent */
            '<div class="line">',
                `<div class="annotation" data-details="${escapedDetails}">`,
                    this._getAnnotationHtml(annotationLine),
                '</div>',
                `<pre><code>${_.escape(annotationLine.lineContents)}</code></pre>`,
            '</div>'
            /* eslint-enable indent */
        ].join('');
    }

    _escapeNewLine(text) {
        return text.split('\n').join('&#xa;');
    }

    _getAnnotationHtml(annotationLine) {
        if (!annotationLine.isCommitted) {
            return `<div class="annotation-inner">${_.escape(annotationLine.caption)}</div>`;
        }
        const safeEncodedCommand = this._getUriString(annotationLine.command);
        return `<a href="${safeEncodedCommand}" class="annotation-inner">${_.escape(annotationLine.caption)}</a>`;
    }

    _getUriString(command) {
        return encodeURI(`command:${command.name}?${JSON.stringify(command.args)}`);
    }
}

module.exports = GitAnnotationDocumentBuilder;
