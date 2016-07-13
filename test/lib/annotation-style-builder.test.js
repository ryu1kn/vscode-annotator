
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
                    annotationTooltipWidth: 'ANNOTATION_TOOLTIP_WIDTH'
                };
                return configs[configName];
            }
        };
        const cssBuilder = new AnnotationStyleBuilder({configStore});
        expect(cssBuilder.build()).to.eql(`
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
                display: -webkit-flex;
                display: flex;
                -webkit-flex-wrap: nowrap;
                flex-wrap: nowrap;
                white-space: nowrap;
                position: relative;
                width: ANNOTATION_COLUMN_WIDTH;
                color: ANNOTATION_FONT_COLOR;
                margin-right: 1em;
            }
            .annotation:hover::after {
                display: block;
                position: absolute;
                z-index: 1;
                content: attr(data-details);
                white-space: pre-wrap;
                top: 0;
                width: ANNOTATION_TOOLTIP_WIDTH;
                background-color: ANNOTATION_TOOLTIP_BACKGROUND_COLOR;
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
            .commit-hash {
                display: block;
            }
            .truncate {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }`);
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
