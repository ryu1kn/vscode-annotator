
const ConfigStore = require('../../lib/config-store');

suite('ConfigStore', () => {

    test('it reads the current editor config from vscode.workspace', () => {
        const editorConfig = {get: stubWithArgs(['CONFIG_NAME'], 'CONFIG_VALUE')};
        const workspace = {getConfiguration: stubWithArgs(['editor'], editorConfig)};
        const configStore = new ConfigStore({workspace});
        expect(configStore.getEditorConfig('CONFIG_NAME')).to.eql('CONFIG_VALUE');
    });

    test('it reads the current editor config from vscode.workspace', () => {
        const gitConfig = {get: stubWithArgs(['CONFIG_NAME'], 'CONFIG_VALUE')};
        const workspace = {getConfiguration: stubWithArgs(['git'], gitConfig)};
        const configStore = new ConfigStore({workspace});
        expect(configStore.getGitConfig('CONFIG_NAME')).to.eql('CONFIG_VALUE');
    });

    test('it reads the current git config from vscode.workspace', () => {
        const extensionConfig = {get: stubWithArgs(['CONFIG_NAME'], 'CONFIG_VALUE')};
        const workspace = {getConfiguration: stubWithArgs(['annotator'], extensionConfig)};
        const configStore = new ConfigStore({workspace});
        expect(configStore.getExtensionConfig('CONFIG_NAME')).to.eql('CONFIG_VALUE');
    });
});
