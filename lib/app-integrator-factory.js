
'use strict';

const vscode = require('vscode');

const AnnotateCommand = require('./command/annotate');
const AppIntegrator = require('./app-integrator');
const ChangedFilePicker = require('./changed-file-picker');
const ChangedFileLabelMaker = require('./changed-file-label-maker');
const ChangedFileListParser = require('./changed-file-list-parser');
const ConfigStore = require('./config-store');
const EditorTitleResolver = require('./editor-title-resolver');
const GitContentProvider = require('./git-content-provider');
const GitAnnotationContentGenerator = require('./git-annotation/git-annotation-content-generator');
const GitAnnotationHtmlDirectorFactory = require('./git-annotation/git-annotation-html-director-factory');
const GitBlameOutputParser = require('./git-blame-output-parser');
const GitService = require('./git-service');
const ShellCommandRunner = require('./shell-command-runner');
const UriService = require('./uri-service');
const SwitchDiffCommand = require('./command/switch-diff');
const TakeDiffCommand = require('./command/take-diff');
const childProcess = require('child_process');

class AppIntegratorFactory {

    create() {
        const logger = console;
        const uriService = new UriService({
            Uri: vscode.Uri,
            getCurrentDateFn: () => Date.now()
        });
        const configStore = new ConfigStore({workspace: vscode.workspace});
        const gitAnnotationHtmlDirectorFactory = new GitAnnotationHtmlDirectorFactory({configStore});
        const gitService = new GitService({
            configStore,
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
        const editorTitleResolver = new EditorTitleResolver({workspaceRoot: vscode.workspace.rootPath});
        const annotateCommand = new AnnotateCommand({commands, editorTitleResolver, logger, uriService});
        const takeDiffCommand = new TakeDiffCommand({commands, editorTitleResolver, logger, uriService});
        const switchDiffCommand = new SwitchDiffCommand({
            logger, uriService, gitService, changedFilePicker, commands
        });
        return new AppIntegrator({
            vscode, gitContentProvider, annotateCommand, switchDiffCommand, takeDiffCommand
        });
    }
}

module.exports = AppIntegratorFactory;
