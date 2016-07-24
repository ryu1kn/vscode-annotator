
'use strict';

class GitAnnotationHtmlDirector {

    constructor(params) {
        this._annotationStyleBuilder = params.annotationStyleBuilder;
        this._annotationScriptProvider = params.annotationScriptProvider;
        this._gitAnnotationHtmlBodyGenerator = params.gitAnnotationHtmlBodyGenerator;
        this._gitAnnotationHtmlBuilder = params.gitAnnotationHtmlBuilder;
    }

    construct(lineBlames, repositoryRootPath) {
        const b = this._gitAnnotationHtmlBuilder;
        b.addCss(this._annotationStyleBuilder.build());
        b.addScript(this._annotationScriptProvider.provide());
        b.addSafeBody(this._gitAnnotationHtmlBodyGenerator.generate(lineBlames, repositoryRootPath));
        return b.getHtml();
    }
}

module.exports = GitAnnotationHtmlDirector;
