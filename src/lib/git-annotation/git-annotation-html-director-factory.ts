import {AnnotationScriptProvider} from '../annotation-script-provider';
import {AnnotationStyleBuilder} from '../annotation-style-builder';

import {CommitColorDesignator} from './commit-color-designator';
import {GitAnnotationLineDirectorFactory} from './git-annotation-line-director-factory';
import {GitAnnotationHtmlBodyGenerator} from './git-annotation-html-body-generator';
import {GitAnnotationHtmlBuilder} from './git-annotation-html-builder';
import {GitAnnotationHtmlDirector} from './git-annotation-html-director';
import {ConfigStore} from '../config-store';

export class GitAnnotationHtmlDirectorFactory {
    private readonly _configStore: ConfigStore;

    constructor(params) {
        this._configStore = params.configStore;
    }

    create() {
        const configStore = this._configStore;
        const gitAnnotationHtmlBodyGenerator = new GitAnnotationHtmlBodyGenerator({
            gitAnnotationLineDirectorFactory: new GitAnnotationLineDirectorFactory()
        });
        return new GitAnnotationHtmlDirector({
            annotationStyleBuilder: new AnnotationStyleBuilder({configStore}),
            annotationScriptProvider: new AnnotationScriptProvider({configStore}),
            commitColorDesignator: new CommitColorDesignator({configStore}),
            gitAnnotationHtmlBodyGenerator,
            gitAnnotationHtmlBuilder: new GitAnnotationHtmlBuilder()
        });
    }

}
