
const AnnotationScriptProvider = require('../../lib/annotation-script-provider');

suite('AnnotationStyleBuilder', () => {

    test('it dynamically builds up CSS from user configurations', () => {
        const configStore = {
            getExtensionConfig: configName => {
                const configs = {annotationFocusColor: 'ANNOTATION_FOCUS_COLOR'};
                return configs[configName];
            }
        };
        const provider = new AnnotationScriptProvider({configStore});
        expect(provider.provide()).to.eql(`
            var stylesheet = document.styleSheets[0];
            var index = null;

            document.body.addEventListener('mouseenter', addCommitHighlightRule, true);
            document.body.addEventListener('mouseleave', removeCommitHighlightRule, true);

            function addCommitHighlightRule(event) {
                if (event.target.className !== 'annotation') return;
                var commitHash = event.target.attributes['data-commitHash'].value;
                var selectorText = '[data-commitHash="' + commitHash + '"]';
                var highlightRule = selectorText + ' {background-color: ANNOTATION_FOCUS_COLOR;}';
                index = 0;
                stylesheet.insertRule(highlightRule, index);
            }

            function removeCommitHighlightRule(event) {
                if (event.target.className !== 'annotation') return;
                if (index !== null) {
                    stylesheet.deleteRule(index);
                    index = null;
                }
            }
        `);
    });
});
