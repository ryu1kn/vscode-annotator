
'use strict';

const vscode = require('vscode');

const AppFactory = require('./app-factory');
const AppIntegrator = require('./app-integrator');
const ConfigStore = require('./config-store');
const GitContentProvider = require('./git-content-provider');
const GitAnnotationContentGenerator = require('./git-annotation/git-annotation-content-generator');
const GitAnnotationHtmlDirectorFactory = require('./git-annotation/git-annotation-html-director-factory');
const GitBlameOutputParser = require('./git-blame-output-parser');
const GitCommand = require('./git-command');
const ShellCommandRunner = require('./shell-command-runner');
const UriService = require('./uri-service');
const childProcess = require('child_process');

class AppIntegratorFactory {

    create() {
        const shellCommandRunner = new ShellCommandRunner({childProcess});
        const logger = console;
        const uriService = new UriService({
            Uri: vscode.Uri,
            getCurrentDateFn: () => Date.now()
        });
        const app = new AppFactory().create({vscode, logger, uriService});
        const configStore = new ConfigStore({workspace: vscode.workspace});
        const gitBlameOutputParser = new GitBlameOutputParser();
        const gitAnnotationHtmlDirectorFactory = new GitAnnotationHtmlDirectorFactory({configStore});
        const gitCommand = new GitCommand({shellCommandRunner});
        const gitAnnotationContentGenerator = new GitAnnotationContentGenerator({
            gitAnnotationHtmlDirectorFactory, gitBlameOutputParser, gitCommand
        });
        const gitContentProvider = new GitContentProvider({
            gitAnnotationContentGenerator, gitCommand, uriService
        });
        return new AppIntegrator({app, vscode, gitContentProvider});
    }
}

module.exports = AppIntegratorFactory;
