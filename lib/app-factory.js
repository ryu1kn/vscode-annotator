
'use strict';

const App = require('./app');
const GitAnnotationLoader = require('./git-annotation-loader');
const GitBlameOutputParser = require('./git-blame-output-parser');

class AppFactory {

    create(params) {
        const vscode = params.vscode;
        const logger = params.logger;
        const annotationData = params.annotationData;
        const gitCommand = params.gitCommand;
        const gitBlameOutputParser = new GitBlameOutputParser();
        const gitAnnotationLoader = new GitAnnotationLoader({gitCommand, gitBlameOutputParser});
        return new App({logger, vscode, annotationData, gitAnnotationLoader});
    }

}

module.exports = AppFactory;
