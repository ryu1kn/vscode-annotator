
'use strict';

const childProcess = require('child_process');
const vscode = require('vscode');

const AnnotateCommand = require('./command/annotate');
const AppIntegrator = require('./app-integrator');
const ChangedFileLabelMaker = require('./changed-file-label-maker');
const ChangedFileListParser = require('./changed-file-list-parser');
const ChangedFilePicker = require('./changed-file-picker');
const ConfigStore = require('./config-store');
const EditorTitleResolver = require('./editor-title-resolver');
const GitAnnotationContentGenerator = require('./git-annotation/git-annotation-content-generator');
const GitAnnotationHtmlDirectorFactory = require('./git-annotation/git-annotation-html-director-factory');
const GitBlameOutputParser = require('./git-blame-output-parser');
const GitContentProvider = require('./git-content-provider');
const GitService = require('./git-service');
const ShellCommandRunner = require('./shell-command-runner');
const SwitchDiffCommand = require('./command/switch-diff');
const TakeDiffCommand = require('./command/take-diff');
const UriService = require('./uri-service');

class AppIntegratorFactory {

    create() {
        return new AppIntegrator({
            vscode,
            gitContentProvider: this._getGitContentProvider(),
            annotateCommand: this._getAnnotateCommand(),
            switchDiffCommand: this._getSwitchDiffCommand(),
            takeDiffCommand: this._getTakeDiffCommand()
        });
    }

    _getAnnotateCommand() {
        this._annotateCommand = this._annotateCommand || this._createAnnotateCommand();
        return this._annotateCommand;
    }

    _createAnnotateCommand() {
        return new AnnotateCommand({
            commands: vscode.commands,
            editorTitleResolver: this._getEditTitleResolver(),
            logger: this._getLogger(),
            uriService: this._getUriService()
        });
    }

    _getChangedFilePicker() {
        this._changedFilePicker = this._changedFilePicker || this._createChangedFilePicker();
        return this._changedFilePicker;
    }

    _createChangedFilePicker() {
        return new ChangedFilePicker({
            changedFileLabelMaker: new ChangedFileLabelMaker(),
            window: vscode.window
        });
    }

    _getConfigStore() {
        this._configStore = this._configStore || this._createConfigStore();
        return this._configStore;
    }

    _createConfigStore() {
        return new ConfigStore({workspace: vscode.workspace});
    }

    _getEditTitleResolver() {
        this._editTitleResolver = this._editTitleResolver || this._createEditTitleResolver();
        return this._editTitleResolver;
    }

    _createEditTitleResolver() {
        return new EditorTitleResolver({workspaceRoot: vscode.workspace.rootPath});
    }

    _getGitAnnotationContentGenerator() {
        this._gitAnnotationContentGenerator = this._gitAnnotationContentGenerator ||
                this._createGitAnnotationContentGenerator();
        return this._gitAnnotationContentGenerator;
    }

    _createGitAnnotationContentGenerator() {
        return new GitAnnotationContentGenerator({
            gitAnnotationHtmlDirectorFactory: this._getGitAnnotationHtmlDirectorFactory(),
            gitService: this._getGitService()
        });
    }

    _getGitAnnotationHtmlDirectorFactory() {
        this._gitAnnotationHtmlDirectorFactory = this._gitAnnotationHtmlDirectorFactory ||
                this._createGitAnnotationHtmlDirectorFactory();
        return this._gitAnnotationHtmlDirectorFactory;
    }

    _createGitAnnotationHtmlDirectorFactory() {
        return new GitAnnotationHtmlDirectorFactory({
            configStore: this._getConfigStore()
        });
    }

    _getGitContentProvider() {
        this._gitContentProvider = this._gitContentProvider || this._createGitContentProvider();
        return this._gitContentProvider;
    }

    _createGitContentProvider() {
        return new GitContentProvider({
            gitAnnotationContentGenerator: this._getGitAnnotationContentGenerator(),
            gitService: this._getGitService(),
            uriService: this._getUriService()
        });
    }

    _getGitService() {
        this._gitService = this._gitService || this._createGitService();
        return this._gitService;
    }

    _createGitService() {
        return new GitService({
            configStore: this._getConfigStore(),
            changedFileListParser: new ChangedFileListParser(),
            gitBlameOutputParser: new GitBlameOutputParser(),
            shellCommandRunner: new ShellCommandRunner({childProcess})
        });
    }

    _getLogger() {
        return console;
    }

    _getSwitchDiffCommand() {
        this._switchDiffCommand = this._switchDiffCommand || this._createSwitchDiffCommand();
        return this._switchDiffCommand;
    }

    _createSwitchDiffCommand() {
        return new SwitchDiffCommand({
            logger: this._getLogger(),
            uriService: this._getUriService(),
            gitService: this._getGitService(),
            changedFilePicker: this._getChangedFilePicker(),
            commands: vscode.commands
        });
    }

    _getTakeDiffCommand() {
        this._takeDiffCommand = this._takeDiffCommand || this._createTakeDiffCommand();
        return this._takeDiffCommand;
    }

    _createTakeDiffCommand() {
        return new TakeDiffCommand({
            commands: vscode.commands,
            editorTitleResolver: this._getEditTitleResolver(),
            logger: this._getLogger(),
            uriService: this._getUriService()
        });
    }

    _getUriService() {
        this._uriService = this._uriService || this._createUriService();
        return this._uriService;
    }

    _createUriService() {
        return new UriService({
            Uri: vscode.Uri,
            getCurrentDateFn: () => Date.now()
        });
    }

}

module.exports = AppIntegratorFactory;
