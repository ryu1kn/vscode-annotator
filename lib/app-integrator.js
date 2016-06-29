
'use strict';

const EXTENSION_NAMESPACE = 'annotation';

class AppIntegrator {
    constructor(params) {
        this._app = params.app;
        this._vscode = params.vscode;
    }

    integrate(context) {
        this._registerTextEditorCommands(context);
        this._registerCommands(context);
    }

    _registerTextEditorCommands(context) {
        const app = this._app;
        const disposable = this._vscode.commands.registerTextEditorCommand(
                `${EXTENSION_NAMESPACE}.annotate`, app.resetCounter.bind(app));
        context.subscriptions.push(disposable);
    }
}

module.exports = AppIntegrator;
