
const AnnotationCssBuilder = require('../../lib/annotation-css-builder');

suite('AnnotationCssBuilder', () => {

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
                    annotationColumnWidth: 'ANNOTATION_COLUMN_WIDTH'
                };
                return configs[configName];
            }
        };
        const cssBuilder = new AnnotationCssBuilder({configStore});
        expect(cssBuilder.build()).to.eql(`
            * {
                font-family: FONT_FAMILY;
                font-size: 10;
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
                color: gray;
                margin-right: 1em;
            }
            .truncate {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }`);
    });
});
