
const _escape = require('lodash.escape');

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
        const safeDetails = this._escapeNewLine(_escape(this._details));
        const safeCommitHash = _escape(this._commitHash);
        return [
            /* eslint-disable indent */
            `<div class="line" data-commitHash="${safeCommitHash}" data-details="${safeDetails}">`,
                '<div class="annotation">',
                    this._annotationHtml,
                '</div>',
                '<div class="commitColor"></div>',
                `<pre><code>${_escape(this._lineContents)}</code></pre>`,
            '</div>'
            /* eslint-enable indent */
        ].join('');
    }

    _escapeNewLine(text) {
        return text.split('\n').join('&#xa;');
    }

    get _annotationHtml() {
        if (!this._command) return `<div class="annotation-inner">${_escape(this._caption)}</div>`;

        const safeEncodedCommand = this._encodeCommand(this._command);
        return `<a href="" data-command="${safeEncodedCommand}" class="annotation-inner">${_escape(this._caption)}</a>`;
    }

    _encodeCommand(command) {
        return encodeURI(JSON.stringify(command));
    }

}

module.exports = GitAnnotationLineBuilder;
