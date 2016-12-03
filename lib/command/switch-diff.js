
const _ = require('lodash');
const querystring = require('querystring');

class SwitchDiffCommand {

    constructor(params) {
        this._logger = params.logger;
        this._uriService = params.uriService;
        this._changedFilePicker = params.changedFilePicker;
        this._gitService = params.gitService;
        this._commands = params.commands;
    }

    execute(editor) {
        return Promise.resolve().then(() => {
            const action = this._uriService.getAction(editor.document.uri);
            if (!action) return;

            const query = querystring.parse(editor.document.uri.query);
            const state = _.pick(query, ['commitHash', 'repositoryRoot']);
            return Promise.resolve(state)
                .then(state => this._getChangedFilesInCommit(state))
                .then(state => this._pickChangedFile(state))
                .then(state => this._takeDiff(state));
        }).catch(e => {
            this._logger.error(e.stack);
        });
    }

    _getChangedFilesInCommit(state) {
        return this._gitService.getChangedFilesInCommit(state.commitHash, state.repositoryRoot)
            .then(parsed => Object.assign(
                {}, state, _.pick(parsed, ['previousCommitHash', 'changedFiles'])
            ));
    }

    _pickChangedFile(state) {
        return this._changedFilePicker.pick(state.changedFiles)
            .then(pickedItem => Object.assign({}, state, {pickedItem}));
    }

    _takeDiff(state) {
        if (!state.pickedItem) return;

        const params = {
            commitHash: state.commitHash,
            previousCommitHash: state.previousCommitHash,
            path: state.pickedItem.path,
            previousPath: state.pickedItem.previousPath,
            repositoryRoot: state.repositoryRoot
        };
        return this._commands.executeCommand('annotator.takeDiff', params);
    }

}

module.exports = SwitchDiffCommand;
