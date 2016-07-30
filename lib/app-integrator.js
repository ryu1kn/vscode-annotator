
'use strict';

const Const = require('./const');

class AppIntegrator {

    constructor(params) {
        this._vscode = params.vscode;
        this._gitContentProvider = params.gitContentProvider;
        this._annotateCommand = params.annotateCommand;
        this._switchDiffCommand = params.switchDiffCommand;
        this._takeDiffCommand = params.takeDiffCommand;
    }

    integrate(context) {
        this._registerProviders(context);
        this._registerTextEditorCommands(context);
        this._registerCommands(context);
    }

    _registerProviders(context) {
        const disposable = this._vscode.workspace.registerTextDocumentContentProvider(
                Const.EXTENSION_NAME, this._gitContentProvider);
        context.subscriptions.push(disposable);
    }

    _registerTextEditorCommands(context) {
        [{
            commandName: 'annotate',
            command: this._annotateCommand
        }, {
            commandName: 'switchDiffInCommit',
            command: this._switchDiffCommand
        }].forEach(item => {
            const command = item.command;
            const disposable = this._vscode.commands.registerTextEditorCommand(
                `${Const.EXTENSION_NAME}.${item.commandName}`,
                command.execute.bind(command)
            );
            context.subscriptions.push(disposable);
        });
    }

    _registerCommands(context) {
        const command = this._takeDiffCommand;
        const disposable = this._vscode.commands.registerCommand(
                `${Const.EXTENSION_NAME}.takeDiff`, command.execute.bind(command));
        context.subscriptions.push(disposable);
    }
}

module.exports = AppIntegrator;
