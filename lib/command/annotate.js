
'use strict';

class AnnotateCommand {

    constructor(params) {
        this._commands = params.commands;
        this._logger = params.logger;
        this._uriService = params.uriService;
    }

    execute(editor) {
        return Promise.resolve().then(() => {
            const uri = this._uriService.convertToAnnotateFileAction(editor.document.uri);
            if (!uri) return;

            const title = this._uriService.getTitle(uri, 'annotation: ');
            return this._commands.executeCommand('vscode.previewHtml', uri, undefined, title);
        }).catch(e => this._logger.error(e.stack));
    }

}

module.exports = AnnotateCommand;
