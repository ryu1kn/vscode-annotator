
class AnnotateCommand {

    constructor(params) {
        this._vscode = params.vscode;
        this._logger = params.logger;
        this._uriService = params.uriService;
        this._editorTitleResolver = params.editorTitleResolver;
        this._contentProvider = params.contentProvider;
    }

    execute(editor) {
        return Promise.resolve().then(() => {
            const uri = this._uriService.convertToAnnotateFileAction(editor.document.uri);
            if (!uri) return;

            const title = this._editorTitleResolver.resolve(uri);
            const panel = this._vscode.window.createWebviewPanel(
                'annotator-annotation', title, this._vscode.ViewColumn.Active, {enableScripts: true}
            );
            return this._contentProvider.provideTextDocumentContent(uri).then(content => {
                panel.webview.html = content;
                panel.onDidDispose(() => {}, null, {});
                panel.webview.onDidReceiveMessage(
                    async message => {
                        try {
                            const command = JSON.parse(decodeURI(message));
                            await this._vscode.commands.executeCommand(command.name, ...command.args);
                        } catch (e) {
                            console.error(e.stack);
                        }
                    },
                    undefined,
                    {}
                );
            });
        }).catch(e => this._logger.error(e.stack));
    }

}

module.exports = AnnotateCommand;
