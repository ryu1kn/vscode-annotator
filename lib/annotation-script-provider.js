
'use strict';

class AnnotationScriptProvider {

    constructor(params) {
        this._configStore = params.configStore;
    }

    provide() {
        const highlightColour = this._configStore.getExtensionConfig('annotationHighlightColor');
        return `
            var stylesheet = document.styleSheets[0];
            var index = null;

            document.body.addEventListener('mouseenter', addCommitHighlightRule, true);
            document.body.addEventListener('mouseleave', removeCommitHighlightRule, true);

            function addCommitHighlightRule(event) {
                if (event.target.className !== 'annotation') return;
                var commitHash = event.target.parentNode.attributes['data-commitHash'].value;
                var selectorText = '.line[data-commitHash="' + commitHash + '"] > .annotation';
                var highlightRule = selectorText + ' {background-color: ${highlightColour};}';
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
        `;
    }
}

module.exports = AnnotationScriptProvider;
