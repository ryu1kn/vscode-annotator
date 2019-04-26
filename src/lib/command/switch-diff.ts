
import querystring = require('querystring');
import {UriService} from '../uri-service';
import {ChangedFilePicker} from '../changed-file-picker';
import {GitService} from '../git-service';

export class SwitchDiffCommand {
    private _logger: Console | { error: any };
    private _uriService: UriService;
    private _changedFilePicker: ChangedFilePicker;
    private _gitService: GitService;
    private _commands: any;

    constructor(params) {
        this._logger = params.logger;
        this._uriService = params.uriService;
        this._changedFilePicker = params.changedFilePicker;
        this._gitService = params.gitService;
        this._commands = params.commands;
    }

    async execute(editor) {
        try {
            const action = this._uriService.getAction(editor.document.uri);
            if (!action) return;

            const {commitHash, repositoryRoot} = querystring.parse(editor.document.uri.query);
            const {previousCommitHash, changedFiles} =
                await this._gitService.getChangedFilesInCommit(commitHash, repositoryRoot);
            const pickedItem = await this._changedFilePicker.pick(changedFiles);
            if (!pickedItem) return;

            const params = {
                commitHash: commitHash,
                previousCommitHash: previousCommitHash,
                path: pickedItem.path,
                previousPath: pickedItem.previousPath,
                repositoryRoot: repositoryRoot
            };
            return this._commands.executeCommand('annotator.takeDiff', params);
        } catch (e) {
            this._logger.error(e.stack);
        }
    }

}
