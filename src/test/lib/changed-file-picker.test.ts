import * as sinon from 'sinon';
import {deepStrictEqual, strictEqual} from 'assert';
import {ChangedFilePicker} from '../../lib/changed-file-picker';

suite('ChangedFilePicker', () => {

    test('it picks one of changed files', async () => {
        const changedFileLabelMaker = {make: () => 'LABEL'};
        const window = fakeWindow({index: 0});
        const changedFilePicker = new ChangedFilePicker({changedFileLabelMaker, window});
        const changedFiles = [
            {path: 'PATH_1', previousPath: 'PREVIOUS_PATH_1'},
            {path: 'PATH_2', previousPath: 'PREVIOUS_PATH_2'}
        ];
        const item = await changedFilePicker.pick(changedFiles);
        deepStrictEqual(item, {path: 'PATH_1', previousPath: 'PREVIOUS_PATH_1'});
    });

    test('it passes LABEL when it invoke QuickPick', async () => {
        const changedFileLabelMaker = {make: () => 'LABEL'};
        const window = fakeWindow({index: 0});
        const changedFilePicker = new ChangedFilePicker({changedFileLabelMaker, window});
        const changedFiles = [
            {changeType: 'M', path: 'PATH', previousPath: 'PATH'}
        ];
        await changedFilePicker.pick(changedFiles);
        const showQuickPickArg = window._showQuickPickSpy.args[0][0];
        strictEqual(showQuickPickArg[0].label, 'LABEL');
    });

    test('it gives back "null" if no item is selected', async () => {
        const changedFileLabelMaker = {make: () => 'LABEL'};
        const window = fakeWindow({index: 'NOT_EXIST'});
        const changedFilePicker = new ChangedFilePicker({changedFileLabelMaker, window});
        const changedFiles = [
            {path: 'PATH', previousPath: 'PREVIOUS_PATH'}
        ];
        const item = await changedFilePicker.pick(changedFiles);
        strictEqual(item, null);
    });

    function fakeWindow(params) {
        return {
            _showQuickPickSpy: sinon.spy(),
            showQuickPick: function (items) {
                this._showQuickPickSpy(items);
                return Promise.resolve(items[params.index] || {});
            }
        };
    }
});
