import {AnnotationStyleBuilder} from '../annotation-style-builder';
import {AnnotationScriptProvider} from '../annotation-script-provider';
import {GitAnnotationHtmlBodyGenerator} from './git-annotation-html-body-generator';
import {GitAnnotationHtmlBuilder} from './git-annotation-html-builder';
import {CommitColorDesignator} from './commit-color-designator';

export class GitAnnotationHtmlDirector {
    private readonly _annotationStyleBuilder: AnnotationStyleBuilder;
    private readonly _annotationScriptProvider: AnnotationScriptProvider;
    private readonly _gitAnnotationHtmlBodyGenerator: GitAnnotationHtmlBodyGenerator;
    private readonly _gitAnnotationHtmlBuilder: GitAnnotationHtmlBuilder;
    private readonly _commitColorDesignator: CommitColorDesignator;

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
