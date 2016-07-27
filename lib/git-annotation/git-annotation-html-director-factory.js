
'use strict';

const AnnotationStyleBuilder = require('../annotation-style-builder');
const AnnotationScriptProvider = require('../annotation-script-provider');
const CommitColorDesignator = require('./commit-color-designator');
const GitAnnotationLineDirectorFactory = require('./git-annotation-line-director-factory');
const GitAnnotationHtmlBodyGenerator = require('./git-annotation-html-body-generator');
const GitAnnotationHtmlBuilder = require('./git-annotation-html-builder');
const GitAnnotationHtmlDirector = require('./git-annotation-html-director');

class GitAnnotationHtmlDirectorFactory {

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

module.exports = GitAnnotationHtmlDirectorFactory;
