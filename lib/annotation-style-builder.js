
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
        const annotationTooltipBackgroundColor =
                this._configStore.getExtensionConfig('annotationTooltipBackgroundColor');
        const annotationTooltipWidth = this._configStore.getExtensionConfig('annotationTooltipWidth');
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
                right: -${annotationTooltipWidth};
                width: ${annotationTooltipWidth};
                background-color: ${annotationTooltipBackgroundColor};
                margin-top: -0.5em;
                margin-right: -1em;
                padding: .5em;
                border-radius: 5px;
            }
            .annotation-inner {
                display: block;
                color: inherit;
                text-decoration: none;
                white-space: pre;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            a.annotation-inner:hover {
                text-decoration: underline;
            }`;
    }
}

module.exports = AnnotationStyleBuilder;
