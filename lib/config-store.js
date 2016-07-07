
'use strict';

class ConfigStore {
    constructor(params) {
        this._workspace = params.workspace;
    }

    getEditorConfig(configName) {
        const extensionConfig = this._workspace.getConfiguration('editor');
        return extensionConfig.get(configName);
    }

    getExtensionConfig(configName) {
        const extensionConfig = this._workspace.getConfiguration('annotation');
        return extensionConfig.get(configName);
    }
}

module.exports = ConfigStore;
