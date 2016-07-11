
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
                    annotationFontColor: 'ANNOTATION_FONT_COLOR'
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
                min-width: ANNOTATION_COLUMN_WIDTH;
                max-width: ANNOTATION_COLUMN_WIDTH;
                color: ANNOTATION_FONT_COLOR;
                margin-right: 1em;
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
