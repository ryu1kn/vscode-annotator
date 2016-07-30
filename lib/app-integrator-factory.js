
'use strict';

const vscode = require('vscode');

const AppFactory = require('./app-factory');
const AppIntegrator = require('./app-integrator');
const ChangedFilePicker = require('./changed-file-picker');
const ChangedFileLabelMaker = require('./changed-file-label-maker');
const ChangedFileListParser = require('./changed-file-list-parser');
const ConfigStore = require('./config-store');
const GitContentProvider = require('./git-content-provider');
const GitAnnotationContentGenerator = require('./git-annotation/git-annotation-content-generator');
const GitAnnotationHtmlDirectorFactory = require('./git-annotation/git-annotation-html-director-factory');
const GitBlameOutputParser = require('./git-blame-output-parser');
const GitService = require('./git-service');
const ShellCommandRunner = require('./shell-command-runner');
const UriService = require('./uri-service');
const childProcess = require('child_process');
const SwitchDiffCommand = require('./switch-diff-command');

class AppIntegratorFactory {

    create() {
        const logger = console;
        const uriService = new UriService({
            Uri: vscode.Uri,
            getCurrentDateFn: () => Date.now()
        });
        const app = new AppFactory().create({vscode, logger, uriService});
        const configStore = new ConfigStore({workspace: vscode.workspace});
        const gitAnnotationHtmlDirectorFactory = new GitAnnotationHtmlDirectorFactory({configStore});
        const gitService = new GitService({
            changedFileListParser: new ChangedFileListParser(),
            gitBlameOutputParser: new GitBlameOutputParser(),
            shellCommandRunner: new ShellCommandRunner({childProcess})
        });
        const gitAnnotationContentGenerator = new GitAnnotationContentGenerator({
            gitAnnotationHtmlDirectorFactory, gitService
        });
        const gitContentProvider = new GitContentProvider({
            gitAnnotationContentGenerator, gitService, uriService
        });
        const changedFileLabelMaker = new ChangedFileLabelMaker();
        const changedFilePicker = new ChangedFilePicker({
            changedFileLabelMaker,
            window: vscode.window
        });
        const commands = vscode.commands;
        const switchDiffCommand = new SwitchDiffCommand({
            logger, uriService, gitService, changedFilePicker, commands
        });
        return new AppIntegrator({app, vscode, gitContentProvider, switchDiffCommand});
    }
}

module.exports = AppIntegratorFactory;
