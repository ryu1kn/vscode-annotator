
'use strict';

class AnnotationStyleBuilder {

    constructor(params) {
        this._configStore = params.configStore;
    }

    build() {
        const fontFamily = this._configStore.getEditorConfig('fontFamily');
        const fontSize = this._configStore.getEditorConfig('fontSize');
        const lineHeight = this._configStore.getEditorConfig('lineHeight');
        const annotationColumnWidth = this._configStore.getExtensionConfig('annotationColumnWidth');
        return `
            * {
                font-family: ${fontFamily};
                font-size: ${fontSize}px;
                line-height: ${lineHeight / fontSize};
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
}

module.exports = AnnotationStyleBuilder;
