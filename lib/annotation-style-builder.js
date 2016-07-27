
'use strict';

const _ = require('lodash');

class AnnotationStyleBuilder {

    constructor(params) {
        this._configStore = params.configStore;
    }

    build(lineBlames) {
        return this._getFixedStyle() + this._getAnnotationColoriseStyle(lineBlames);
    }

    _getFixedStyle() {
        const config = this._configStore;
        const fontFamily = config.getEditorConfig('fontFamily');
        const fontSize = config.getEditorConfig('fontSize');
        const lineHeight = config.getEditorConfig('lineHeight');
        const effectiveLineHeight = lineHeight ? (lineHeight / fontSize) : 1.5;
        const annotationColumnWidth = config.getExtensionConfig('annotationColumnWidth');
        const annotationCommitColorBarWidth = config.getExtensionConfig('annotationCommitColorBarWidth');
        const annotationFontColour = config.getExtensionConfig('annotationFontColor');
        const annotationTooltipBackgroundColor =
                config.getExtensionConfig('annotationTooltipBackgroundColor');
        const annotationTooltipWidth = config.getExtensionConfig('annotationTooltipWidth');
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
                min-width: ${annotationColumnWidth};
                max-width: ${annotationColumnWidth};
                color: ${annotationFontColour};
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
            .annotation-inner:hover {
                text-decoration: underline;
            }
            .commitColor {
                min-width: ${annotationCommitColorBarWidth};
                max-width: ${annotationCommitColorBarWidth};
                margin: 0 1em 0 .5em;
            }
        `;
    }

    _getAnnotationColoriseStyle(commitColorMap) {
        return _.map(commitColorMap, (color, commitHash) =>
            `.line[data-commitHash="${commitHash}"] > .commitColor {background-color: ${color};}`
        ).join('\n');
    }
}

module.exports = AnnotationStyleBuilder;
