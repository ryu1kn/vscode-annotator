
'use strict';

const GitAnnotationLineBuilder = require('./git-annotation-line-builder');
const GitAnnotationLineDirector = require('./git-annotation-line-director');

class GitAnnotationDocumentBuilder {

    constructor(params) {
        this._annotationStyleBuilder = params.annotationStyleBuilder;
    }

    build(lineBlames, repositoryRootPath) {
        const digitsCount = String(lineBlames.length).length;
        const safeHtmlBody = lineBlames.map((lineBlame, index) => {
            const builder = new GitAnnotationLineBuilder();
            const director = new GitAnnotationLineDirector(builder);
            return director.construct({
                lineBlame,
                lineNumber: index + 1,
                lineNumberWidth: digitsCount,
                repositoryRoot: repositoryRootPath
            });
        }).join('');
        const safeCss = this._annotationStyleBuilder.build();
        return `<style>${safeCss}</style><body>${safeHtmlBody}</body>`;
    }
}

module.exports = GitAnnotationDocumentBuilder;
