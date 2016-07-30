
'use strict';

const querystring = require('querystring');

class SwitchDiffCommand {

    constructor(params) {
        this._logger = params.logger;
        this._uriService = params.uriService;
        this._changedFilePicker = params.changedFilePicker;
        this._changedFileListParser = params.changedFileListParser;
        this._gitCommand = params.gitCommand;
        this._commands = params.commands;
    }

    execute(editor) {
        return Promise.resolve().then(() => {
            const action = this._uriService.getAction(editor.document.uri);
            if (!action) return;

            const query = querystring.parse(editor.document.uri.query);
            return this._gitCommand.diffTree(query.commitHash, query.repositoryRoot).then(gitOutput => {
                const items = this._changedFileListParser.parse(gitOutput);
                return this._changedFilePicker.pick(items);
            }).then(pickedItem => {
                const params = {
                    commitHash: query.commitHash,
                    previousCommitHash: query.previousCommitHash,
                    path: pickedItem.path,
                    previousPath: pickedItem.previousPath,
                    repositoryRoot: query.repositoryRoot
                };
                return this._commands.executeCommand('annotator.takeDiff', params);
            });
        }).catch(e => {
            this._logger.error(e.stack);
        });
    }

}

module.exports = SwitchDiffCommand;
