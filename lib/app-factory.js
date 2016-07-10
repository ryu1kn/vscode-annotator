
'use strict';

const App = require('./app');
const GitAnnotationLoader = require('./git-annotation-loader');
const GitBlameOutputParser = require('./git-blame-output-parser');

class AppFactory {

    create(params) {
        const commands = params.vscode.commands;
        const Uri = params.vscode.Uri;
        const logger = params.logger;
        const annotationData = params.annotationData;
        const gitCommand = params.gitCommand;
        const gitBlameOutputParser = new GitBlameOutputParser();
        const gitAnnotationLoader = new GitAnnotationLoader({gitCommand, gitBlameOutputParser});
        return new App({logger, commands, Uri, annotationData, gitAnnotationLoader});
    }

}

module.exports = AppFactory;
