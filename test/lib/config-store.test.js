
const ConfigStore = require('../../lib/config-store');

suite('ConfigStore', () => {

    test('it gets the current editor config from vscode.workspace', () => {
        const extensionConfig = {get: stubWithArgs(['CONFIG_NAME'], 'CONFIG_VALUE')};
        const workspace = {getConfiguration: stubWithArgs(['editor'], extensionConfig)};
        const configStore = new ConfigStore({workspace});
        expect(configStore.getEditorConfig('CONFIG_NAME')).to.eql('CONFIG_VALUE');
    });

    test('it gets the current extension config from vscode.workspace', () => {
        const extensionConfig = {get: stubWithArgs(['CONFIG_NAME'], 'CONFIG_VALUE')};
        const workspace = {getConfiguration: stubWithArgs(['annotation'], extensionConfig)};
        const configStore = new ConfigStore({workspace});
        expect(configStore.getExtensionConfig('CONFIG_NAME')).to.eql('CONFIG_VALUE');
    });
});
