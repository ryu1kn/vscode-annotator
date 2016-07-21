
'use strict';

class GitAnnotationDocumentBuilder {

    constructor(params) {
        this._annotationStyleBuilder = params.annotationStyleBuilder;
        this._gitAnnotationLineDirectorFactory = params.gitAnnotationLineDirectorFactory;
    }

    build(lineBlames, repositoryRootPath) {
        const safeHtmlBody = this._getSafeHtmlBody(lineBlames, repositoryRootPath);
        const safeCss = this._annotationStyleBuilder.build();
        return `<style>${safeCss}</style><body>${safeHtmlBody}</body>`;
    }

    _getSafeHtmlBody(lineBlames, repositoryRootPath) {
        const digitsCount = String(lineBlames.length).length;
        return lineBlames.map((lineBlame, index) => {
            const director = this._gitAnnotationLineDirectorFactory.create();
            return director.construct({
                lineBlame,
                lineNumber: index + 1,
                lineNumberWidth: digitsCount,
                repositoryRoot: repositoryRootPath
            });
        }).join('');
    }
}

module.exports = GitAnnotationDocumentBuilder;
