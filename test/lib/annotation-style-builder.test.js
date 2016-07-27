
const AnnotationStyleBuilder = require('../../lib/annotation-style-builder');

suite('AnnotationStyleBuilder', () => {

    test('it dynamically builds up CSS from user configurations', () => {
        const configStore = {
            getEditorConfig: configName => {
                const configs = {
                    fontFamily: 'FONT_FAMILY',
                    fontSize: 10,
                    lineHeight: 15
                };
                return configs[configName];
            },
            getExtensionConfig: configName => {
                const configs = {
                    annotationColumnWidth: 'ANNOTATION_COLUMN_WIDTH',
                    annotationFontColor: 'ANNOTATION_FONT_COLOR',
                    annotationTooltipBackgroundColor: 'ANNOTATION_TOOLTIP_BACKGROUND_COLOR',
                    annotationTooltipWidth: 'ANNOTATION_TOOLTIP_WIDTH',
                    annotationCommitColorBarWidth: 'ANNOTATION_COMMIT_COLOR_BAR_WIDTH'
                };
                return configs[configName];
            }
        };
        const commitColorMap = {COMMIT_1: 'COLOR_1', COMMIT_2: 'COLOR_2'};
        const cssBuilder = new AnnotationStyleBuilder({configStore});
        expect(cssBuilder.build(commitColorMap)).to.eql(`
            * {
                font-family: FONT_FAMILY;
                font-size: 10px;
                line-height: 1.5;
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
                min-width: ANNOTATION_COLUMN_WIDTH;
                max-width: ANNOTATION_COLUMN_WIDTH;
                color: ANNOTATION_FONT_COLOR;
            }
            .annotation:hover::after {
                display: block;
                position: absolute;
                z-index: 1;
                content: attr(data-details);
                white-space: pre-wrap;
                top: 0;
                right: -ANNOTATION_TOOLTIP_WIDTH;
                width: ANNOTATION_TOOLTIP_WIDTH;
                background-color: ANNOTATION_TOOLTIP_BACKGROUND_COLOR;
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
                min-width: ANNOTATION_COMMIT_COLOR_BAR_WIDTH;
                max-width: ANNOTATION_COMMIT_COLOR_BAR_WIDTH;
                margin: 0 1em 0 .5em;
            }
        .line[data-commitHash="COMMIT_1"] > .commitColor {background-color: COLOR_1;}
.line[data-commitHash="COMMIT_2"] > .commitColor {background-color: COLOR_2;}`);
    });

    test('it specifies line-height 1.5 if its value is falsy', () => {
        const configStore = {
            getEditorConfig: configName => {
                const configs = {
                    fontFamily: 'FONT_FAMILY',
                    fontSize: 10,
                    lineHeight: 0
                };
                return configs[configName];
            },
            getExtensionConfig: () => {}
        };
        const cssBuilder = new AnnotationStyleBuilder({configStore});
        expect(cssBuilder.build()).to.have.string('line-height: 1.5;');
    });
});
