
'use strict';

const vscode = require('vscode');

const AnnotationData = require('./annotation-data');
const AnnotationStyleBuilder = require('./annotation-style-builder');
const AppFactory = require('./app-factory');
const AppIntegrator = require('./app-integrator');
const ConfigStore = require('./config-store');
const GitAnnotationDocumentBuilder = require('./git-annotation-document-builder');
const GitAnnotationContentProvider = require('./git-annotation-content-provider');
const GitCommand = require('./git-command');
const ShellCommandRunner = require('./shell-command-runner');
const childProcess = require('child_process');

class AppIntegratorFactory {

    create() {
        const annotationData = new AnnotationData();
        const shellCommandRunner = new ShellCommandRunner({childProcess});
        const gitCommand = new GitCommand({shellCommandRunner});
        const logger = console;
        const app = new AppFactory().create({vscode, logger, annotationData, gitCommand});
        const configStore = new ConfigStore({workspace: vscode.workspace});
        const annotationStyleBuilder = new AnnotationStyleBuilder({configStore});
        const gitAnnotationDocumentBuilder = new GitAnnotationDocumentBuilder({annotationStyleBuilder});
        const gitAnnotationContentProvider = new GitAnnotationContentProvider({
            annotationData, gitAnnotationDocumentBuilder, gitCommand
        });
        return new AppIntegrator({app, vscode, gitAnnotationContentProvider});
    }
}

module.exports = AppIntegratorFactory;
