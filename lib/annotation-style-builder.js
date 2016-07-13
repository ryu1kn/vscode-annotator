
'use strict';

class AnnotationStyleBuilder {

    constructor(params) {
        this._configStore = params.configStore;
    }

    build() {
        const fontFamily = this._configStore.getEditorConfig('fontFamily');
        const fontSize = this._configStore.getEditorConfig('fontSize');
        const lineHeight = this._configStore.getEditorConfig('lineHeight');
        const effectiveLineHeight = lineHeight ? (lineHeight / fontSize) : 1.5;
        const annotationColumnWidth = this._configStore.getExtensionConfig('annotationColumnWidth');
        const annotationFontColour = this._configStore.getExtensionConfig('annotationFontColor');
        return `
            * {
                font-family: ${fontFamily};
                font-size: ${fontSize}px;
                line-height: ${effectiveLineHeight};
                margin: 0;
            }
            .line {
                display: -webkit-flex;
                display: flex;
                -webkit-flex-wrap: nowrap;
                flex-wrap: nowrap;
            }
            .annotation {
                display: -webkit-flex;
                display: flex;
                -webkit-flex-wrap: nowrap;
                flex-wrap: nowrap;
                position: relative;
                width: ${annotationColumnWidth};
                color: ${annotationFontColour};
                margin-right: 1em;
            }
            .annotation:hover::after {
                display: block;
                position: absolute;
                z-index: 1;
                content: attr(data-details);
                white-space: pre-wrap;
                top: 0;
                width: 25em;
                background-color: #222;
                margin-top: -0.5em;
                padding: .5em;
                border-radius: 5px;
            }
            .short-info {
                margin-left: .5em;
            }
            .short-info:hover {
                text-decoration: underline;
            }
            .commit-link {
                display: block;
            }
            .truncate {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }`;
    }
}

module.exports = AnnotationStyleBuilder;
