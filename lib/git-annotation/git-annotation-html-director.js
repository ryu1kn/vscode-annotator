
'use strict';

class GitAnnotationHtmlDirector {

    constructor(params) {
        this._annotationStyleBuilder = params.annotationStyleBuilder;
        this._annotationScriptProvider = params.annotationScriptProvider;
        this._gitAnnotationHtmlBodyGenerator = params.gitAnnotationHtmlBodyGenerator;
        this._gitAnnotationHtmlBuilder = params.gitAnnotationHtmlBuilder;
        this._commitColorDesignator = params.commitColorDesignator;
    }

    construct(lineBlames, repositoryRootPath) {
        const commitColorMap = this._commitColorDesignator.designate(lineBlames);
        const b = this._gitAnnotationHtmlBuilder;
        b.addCss(this._annotationStyleBuilder.build(commitColorMap));
        b.addScript(this._annotationScriptProvider.provide());
        b.addSafeBody(this._gitAnnotationHtmlBodyGenerator.generate(lineBlames, repositoryRootPath));
        return b.getHtml();
    }
}

module.exports = GitAnnotationHtmlDirector;
