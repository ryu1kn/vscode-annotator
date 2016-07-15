
'use strict';

const App = require('./app');
const GitAnnotationLoader = require('./git-annotation-loader');
const GitBlameOutputParser = require('./git-blame-output-parser');
const UriService = require('./uri-service');

class AppFactory {

    create(params) {
        const commands = params.vscode.commands;
        const logger = params.logger;
        const annotationData = params.annotationData;
        const gitCommand = params.gitCommand;
        const gitBlameOutputParser = new GitBlameOutputParser();
        const gitAnnotationLoader = new GitAnnotationLoader({gitCommand, gitBlameOutputParser});
        const uriService = new UriService({
            Uri: params.vscode.Uri,
            getCurrentDateFn: () => Date.now()
        });
        return new App({logger, commands, annotationData, gitAnnotationLoader, uriService});
    }

}

module.exports = AppFactory;
