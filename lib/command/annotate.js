class AnnotateCommand {

    constructor(params) {
        this._vscode = params.vscode;
        this._extensionContext = params.extensionContext;
        this._logger = params.logger;
        this._uriService = params.uriService;
        this._editorTitleResolver = params.editorTitleResolver;
        this._contentProvider = params.contentProvider;
    }

    async execute(editor) {
        try {
            const uri = this._uriService.convertToAnnotateFileAction(editor.document.uri);
            if (!uri) return;

            const title = this._editorTitleResolver.resolve(uri);
            const panel = this._vscode.window.createWebviewPanel('annotator-annotation',
                title, this._vscode.ViewColumn.Active, {enableScripts: true});
            panel.webview.html = await this._contentProvider.provideTextDocumentContent(uri);
            panel.webview.onDidReceiveMessage(
                async message => {
                    try {
                        const command = JSON.parse(decodeURI(message));
                        await this._vscode.commands.executeCommand(command.name, ...command.args);
                    } catch (e) {
                        this._logger.error(e.stack);
                    }
                },
                null,
                this._extensionContext.subscriptions
            );
        } catch (e) {
            this._logger.error(e.stack);
        }
    }

}

module.exports = AnnotateCommand;
