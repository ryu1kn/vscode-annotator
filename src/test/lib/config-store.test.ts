import {ConfigStore} from '../../lib/config-store';
import {stubWithArgs} from '../helper/assert';
import {strictEqual} from 'assert';

suite('ConfigStore', () => {

    test('it reads the current editor config from vscode.workspace', () => {
        const editorConfig = {get: stubWithArgs(['CONFIG_NAME'], 'CONFIG_VALUE')};
        const workspace = {getConfiguration: stubWithArgs(['editor'], editorConfig)};
        const configStore = new ConfigStore({workspace});
        strictEqual(configStore.getEditorConfig('CONFIG_NAME'), 'CONFIG_VALUE');
    });

    test('it reads the current editor config from vscode.workspace', () => {
        const gitConfig = {get: stubWithArgs(['CONFIG_NAME'], 'CONFIG_VALUE')};
        const workspace = {getConfiguration: stubWithArgs(['git'], gitConfig)};
        const configStore = new ConfigStore({workspace});
        strictEqual(configStore.getGitConfig('CONFIG_NAME'), 'CONFIG_VALUE');
    });

    test('it reads the current git config from vscode.workspace', () => {
        const extensionConfig = {get: stubWithArgs(['CONFIG_NAME'], 'CONFIG_VALUE')};
        const workspace = {getConfiguration: stubWithArgs(['annotator'], extensionConfig)};
        const configStore = new ConfigStore({workspace});
        strictEqual(configStore.getExtensionConfig('CONFIG_NAME'), 'CONFIG_VALUE');
    });
});
