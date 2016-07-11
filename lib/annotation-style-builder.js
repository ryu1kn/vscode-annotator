
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
                min-width: ${annotationColumnWidth};
                max-width: ${annotationColumnWidth};
                color: ${annotationFontColour};
                margin-right: 1em;
            }
            .truncate {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }`;
    }
}

module.exports = AnnotationStyleBuilder;
