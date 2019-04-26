import {ChangedFileLabelMaker} from '../../lib/changed-file-label-maker';
import {expect} from '../helper/assert';

suite('ChangedFileLabelMaker', () => {

    test('it gives a title for file modification', () => {
        const labelMaker = new ChangedFileLabelMaker();
        const fileChange = {changeType: 'M', path: 'PATH', previousPath: 'PATH'};
        expect(labelMaker.make(fileChange)).to.eql('[ M ] PATH');
    });

    test('it gives a title for file rename', () => {
        const labelMaker = new ChangedFileLabelMaker();
        const fileChange = {changeType: 'R', path: 'PATH', previousPath: 'PREVIOUS_PATH'};
        expect(labelMaker.make(fileChange)).to.eql('[ R ] PREVIOUS_PATH \u2192 PATH');
    });

    test('it gives a title for file addition', () => {
        const labelMaker = new ChangedFileLabelMaker();
        const fileChange = {changeType: 'A', path: 'PATH', previousPath: 'PREVIOUS_PATH'};
        expect(labelMaker.make(fileChange)).to.eql('[ A ] PATH');
    });

    test('it gives a title for file deletion', () => {
        const labelMaker = new ChangedFileLabelMaker();
        const fileChange = {changeType: 'D', path: null, previousPath: 'PREVIOUS_PATH'};
        expect(labelMaker.make(fileChange)).to.eql('[ D ] PREVIOUS_PATH');
    });

    test('it gives a title for other file changes', () => {
        const labelMaker = new ChangedFileLabelMaker();
        const fileChange = {changeType: '?', path: 'PATH', previousPath: 'PREVIOUS_PATH'};
        expect(labelMaker.make(fileChange)).to.eql('[ ? ] PATH');
    });
});
