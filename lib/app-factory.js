
'use strict';

const App = require('./app');
const GitAnnotationLoader = require('./git-annotation-loader');
const GitBlameOutputParser = require('./git-blame-output-parser');
const GitCommand = require('./git-command');

class AppFactory {

    create(vscode, logger, annotationData) {
        const gitCommand = new GitCommand();
        const gitBlameOutputParser = new GitBlameOutputParser();
        const gitAnnotationLoader = new GitAnnotationLoader({gitCommand, gitBlameOutputParser});
        return new App({logger, vscode, annotationData, gitAnnotationLoader});
    }

}

module.exports = AppFactory;
