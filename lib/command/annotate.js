
'use strict';

class AnnotateCommand {

    constructor(params) {
        this._commands = params.commands;
        this._logger = params.logger;
        this._uriService = params.uriService;
        this._editorTitleResolver = params.editorTitleResolver;
    }

    execute(editor) {
        return Promise.resolve().then(() => {
            const uri = this._uriService.convertToAnnotateFileAction(editor.document.uri);
            if (!uri) return;

            const title = this._editorTitleResolver.resolve(uri);
            return this._commands.executeCommand('vscode.previewHtml', uri, undefined, title);
        }).catch(e => this._logger.error(e.stack));
    }

}

module.exports = AnnotateCommand;
