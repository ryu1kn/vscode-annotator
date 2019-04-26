import * as Const from './const';
import {GitContentProvider} from './git-content-provider';
import {AnnotateCommand} from './command/annotate';
import {SwitchDiffCommand} from './command/switch-diff';
import {TakeDiffCommand} from './command/take-diff';

export class AppIntegrator {
    private _vscode: any;
    private _gitContentProvider: GitContentProvider;
    private _annotateCommand: AnnotateCommand;
    private _switchDiffCommand: SwitchDiffCommand;
    private _takeDiffCommand: TakeDiffCommand;

    constructor(params) {
        this._vscode = params.vscode;
        this._gitContentProvider = params.gitContentProvider;
        this._annotateCommand = params.annotateCommand;
        this._switchDiffCommand = params.switchDiffCommand;
        this._takeDiffCommand = params.takeDiffCommand;
    }

    integrate(context) {
        this._registerProviders(context);
        this._registerCommands(context);
    }

    _registerProviders(context) {
        const disposable = this._vscode.workspace.registerTextDocumentContentProvider(
            Const.EXTENSION_NAME, this._gitContentProvider);
        context.subscriptions.push(disposable);
    }

    _registerCommands(context) {
        this._getCommands().forEach(command => {
            const handler = command.handler;
            const registrar = this._getCommandRegistrar(command.type);
            const disposable = this._vscode.commands[registrar](
                `${Const.EXTENSION_NAME}.${command.name}`,
                handler.execute.bind(handler)
            );
            context.subscriptions.push(disposable);
        });
    }

    _getCommands() {
        return [
            {
                name: 'annotate',
                type: 'TEXT_EDITOR',
                handler: this._annotateCommand
            },
            {
                name: 'switchDiffWithinCommit',
                type: 'TEXT_EDITOR',
                handler: this._switchDiffCommand
            },
            {
                name: 'takeDiff',
                type: 'GENERAL',
                handler: this._takeDiffCommand
            }
        ];
    }

    _getCommandRegistrar(type) {
        switch (type) {
        case 'TEXT_EDITOR':
            return 'registerTextEditorCommand';
        case 'GENERAL':
            return 'registerCommand';
        default:
            throw new Error(`Invalid command type ${type}`);
        }
    }

}
