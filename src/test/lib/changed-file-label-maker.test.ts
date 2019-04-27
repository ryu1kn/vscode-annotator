import {ChangedFileLabelMaker} from '../../lib/changed-file-label-maker';
import {strictEqual} from 'assert';

suite('ChangedFileLabelMaker', () => {
    let labelMaker;

    setup(() => {
        labelMaker = new ChangedFileLabelMaker();
    });

    test('it gives a title for file modification', () => {
        const fileChange = {changeType: 'M', path: 'PATH', previousPath: 'PATH'};
        strictEqual(labelMaker.make(fileChange), '[ M ] PATH');
    });

    test('it gives a title for file rename', () => {
        const fileChange = {changeType: 'R', path: 'PATH', previousPath: 'PREVIOUS_PATH'};
        strictEqual(labelMaker.make(fileChange), '[ R ] PREVIOUS_PATH \u2192 PATH');
    });

    test('it gives a title for file addition', () => {
        const fileChange = {changeType: 'A', path: 'PATH', previousPath: 'PREVIOUS_PATH'};
        strictEqual(labelMaker.make(fileChange), '[ A ] PATH');
    });

    test('it gives a title for file deletion', () => {
        const fileChange = {changeType: 'D', path: null, previousPath: 'PREVIOUS_PATH'};
        strictEqual(labelMaker.make(fileChange), '[ D ] PREVIOUS_PATH');
    });

    test('it gives a title for other file changes', () => {
        const fileChange = {changeType: '?', path: 'PATH', previousPath: 'PREVIOUS_PATH'};
        strictEqual(labelMaker.make(fileChange), '[ ? ] PATH');
    });
});
