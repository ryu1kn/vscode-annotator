
'use strict';

const vscode = require('vscode');

const AnnotationStyleBuilder = require('./annotation-style-builder');
const AppFactory = require('./app-factory');
const AppIntegrator = require('./app-integrator');
const ConfigStore = require('./config-store');
const GitContentProvider = require('./git-content-provider');
const GitAnnotationDocumentBuilder = require('./git-annotation-document-builder');
const GitAnnotationLoader = require('./git-annotation-loader');
const GitBlameOutputParser = require('./git-blame-output-parser');
const GitCommand = require('./git-command');
const ShellCommandRunner = require('./shell-command-runner');
const childProcess = require('child_process');

class AppIntegratorFactory {

    create() {
        const shellCommandRunner = new ShellCommandRunner({childProcess});
        const gitCommand = new GitCommand({shellCommandRunner});
        const logger = console;
        const app = new AppFactory().create({vscode, logger, gitCommand});
        const configStore = new ConfigStore({workspace: vscode.workspace});
        const annotationStyleBuilder = new AnnotationStyleBuilder({configStore});
        const gitBlameOutputParser = new GitBlameOutputParser();
        const gitAnnotationDocumentBuilder = new GitAnnotationDocumentBuilder({annotationStyleBuilder});
        const gitAnnotationLoader = new GitAnnotationLoader({gitBlameOutputParser, gitCommand});
        const gitContentProvider = new GitContentProvider({
            gitAnnotationDocumentBuilder, gitAnnotationLoader, gitCommand
        });
        return new AppIntegrator({app, vscode, gitContentProvider});
    }
}

module.exports = AppIntegratorFactory;
