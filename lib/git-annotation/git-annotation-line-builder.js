
'use strict';

const _ = require('lodash');

class GitAnnotationLineBuilder {

    addDetails(details) {
        this._details = details;
    }

    addCommand(command) {
        this._command = command;
    }

    addCaption(caption) {
        this._caption = caption;
    }

    addCommitHash(commitHash) {
        this._commitHash = commitHash;
    }

    addLineContents(lineContents) {
        this._lineContents = lineContents;
    }

    getHtml() {
        const safeDetails = this._escapeNewLine(_.escape(this._details));
        const safeCommitHash = _.escape(this._commitHash);
        return [
            /* eslint-disable indent */
            '<div class="line">',
                `<div class="annotation" data-details="${safeDetails}" data-commitHash="${safeCommitHash}">`,
                    this._annotationHtml,
                '</div>',
                `<pre><code>${_.escape(this._lineContents)}</code></pre>`,
            '</div>'
            /* eslint-enable indent */
        ].join('');
    }

    _escapeNewLine(text) {
        return text.split('\n').join('&#xa;');
    }

    get _annotationHtml() {
        if (!this._command) return `<div class="annotation-inner">${_.escape(this._caption)}</div>`;

        const safeEncodedCommand = this._getUriString(this._command);
        return `<a href="${safeEncodedCommand}" class="annotation-inner">${_.escape(this._caption)}</a>`;
    }

    _getUriString(command) {
        return encodeURI(`command:${command.name}?${JSON.stringify(command.args)}`);
    }
}

module.exports = GitAnnotationLineBuilder;
