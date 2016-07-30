
const ChangedFilePicker = require('../../lib/changed-file-picker');

suite('ChangedFilePicker', () => {

    test('it picks one of changed files', () => {
        const changedFileLabelMaker = {make: () => 'LABEL'};
        const window = fakeWindow({index: 0});
        const changedFilePicker = new ChangedFilePicker({changedFileLabelMaker, window});
        const changedFiles = [
            {path: 'PATH_1', previousPath: 'PREVIOUS_PATH_1'},
            {path: 'PATH_2', previousPath: 'PREVIOUS_PATH_2'}
        ];
        return changedFilePicker.pick(changedFiles).then(item => {
            expect(item).to.eql({path: 'PATH_1', previousPath: 'PREVIOUS_PATH_1'});
        });
    });

    test('it passes LABEL when it invoke QuickPick', () => {
        const changedFileLabelMaker = {make: () => 'LABEL'};
        const window = fakeWindow({index: 0});
        const changedFilePicker = new ChangedFilePicker({changedFileLabelMaker, window});
        const changedFiles = [
            {changeType: 'M', path: 'PATH', previousPath: 'PATH'}
        ];
        return changedFilePicker.pick(changedFiles).then(() => {
            const showQuickPickArg = window._showQuickPickSpy.args[0][0];
            expect(showQuickPickArg[0].label).to.eql('LABEL');
        });
    });

    function fakeWindow(params) {
        return {
            _showQuickPickSpy: sinon.spy(),
            showQuickPick: function (items) {
                this._showQuickPickSpy(items);
                return Promise.resolve(items[params.index]);
            }
        };
    }
});
