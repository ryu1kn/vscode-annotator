
'use strict';

const EXTENSION_NAMESPACE = 'annotation';

class AppIntegrator {

    constructor(params) {
        this._app = params.app;
        this._vscode = params.vscode;
        this._gitAnnotationContentProvider = params.gitAnnotationContentProvider;
    }

    integrate(context) {
        this._registerProviders(context);
        this._registerTextEditorCommands(context);
        this._registerCommands(context);
    }

    _registerProviders(context) {
        const disposable = this._vscode.workspace.registerTextDocumentContentProvider(
                `${EXTENSION_NAMESPACE}`, this._gitAnnotationContentProvider);
        context.subscriptions.push(disposable);
    }

    _registerTextEditorCommands(context) {
        const app = this._app;
        const disposable = this._vscode.commands.registerTextEditorCommand(
                `${EXTENSION_NAMESPACE}.annotate`, app.annotate.bind(app));
        context.subscriptions.push(disposable);
    }

    _registerCommands(context) {
        const app = this._app;
        const disposable = this._vscode.commands.registerCommand(
                `${EXTENSION_NAMESPACE}.takeDiff`, app.takeDiff.bind(app));
        context.subscriptions.push(disposable);
    }
}

module.exports = AppIntegrator;
