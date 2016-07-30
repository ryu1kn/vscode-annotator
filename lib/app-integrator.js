
'use strict';

const Const = require('./const');

class AppIntegrator {

    constructor(params) {
        this._app = params.app;
        this._vscode = params.vscode;
        this._gitContentProvider = params.gitContentProvider;
        this._switchDiffCommand = params.switchDiffCommand;
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
        const app = this._app;
        const disposable = this._vscode.commands.registerTextEditorCommand(
                `${Const.EXTENSION_NAME}.annotate`, app.annotate.bind(app));
        context.subscriptions.push(disposable);

        const disposable2 = this._vscode.commands.registerTextEditorCommand(
                `${Const.EXTENSION_NAME}.switchDiffInCommit`,
                this._switchDiffCommand.execute.bind(this._switchDiffCommand));
        context.subscriptions.push(disposable2);
    }

    _registerCommands(context) {
        const app = this._app;
        const disposable = this._vscode.commands.registerCommand(
                `${Const.EXTENSION_NAME}.takeDiff`, app.takeDiff.bind(app));
        context.subscriptions.push(disposable);
    }
}

module.exports = AppIntegrator;
