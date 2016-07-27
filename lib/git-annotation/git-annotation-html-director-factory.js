
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
        const gitAnnotationHtmlBodyGenerator = new GitAnnotationHtmlBodyGenerator({
            gitAnnotationLineDirectorFactory: new GitAnnotationLineDirectorFactory()
        });
        return new GitAnnotationHtmlDirector({
            annotationStyleBuilder: new AnnotationStyleBuilder({configStore: this._configStore}),
            annotationScriptProvider: new AnnotationScriptProvider({configStore: this._configStore}),
            commitColorDesignator: new CommitColorDesignator({startColor: '#b36b00', endColor: '#ffd699'}),
            gitAnnotationHtmlBodyGenerator,
            gitAnnotationHtmlBuilder: new GitAnnotationHtmlBuilder()
        });
    }
}

module.exports = GitAnnotationHtmlDirectorFactory;
