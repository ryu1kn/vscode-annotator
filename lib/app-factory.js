
'use strict';

const App = require('./app');
const GitAnnotationLoader = require('./git-annotation-loader');
const GitBlameOutputParser = require('./git-blame-output-parser');
const GitCommand = require('./git-command');
const ShellCommandRunner = require('./shell-command-runner');
const childProcess = require('child_process');

class AppFactory {

    create(vscode, logger, annotationData) {
        const shellCommandRunner = new ShellCommandRunner({childProcess});
        const gitCommand = new GitCommand({shellCommandRunner});
        const gitBlameOutputParser = new GitBlameOutputParser();
        const gitAnnotationLoader = new GitAnnotationLoader({gitCommand, gitBlameOutputParser});
        return new App({logger, vscode, annotationData, gitAnnotationLoader});
    }

}

module.exports = AppFactory;
