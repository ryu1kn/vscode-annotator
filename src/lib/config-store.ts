import * as Const from './const';

export class ConfigStore {
    private _workspace: any;

    constructor(params) {
        this._workspace = params.workspace;
    }

    getEditorConfig(configName) {
        const extensionConfig = this._workspace.getConfiguration('editor');
        return extensionConfig.get(configName);
    }

    getGitConfig(configName) {
        const extensionConfig = this._workspace.getConfiguration('git');
        return extensionConfig.get(configName);
    }

    getExtensionConfig(configName) {
        const extensionConfig = this._workspace.getConfiguration(Const.EXTENSION_NAME);
        return extensionConfig.get(configName);
    }

}
