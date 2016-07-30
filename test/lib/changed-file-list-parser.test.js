
const ChangedFileListParser = require('../../lib/changed-file-list-parser');

suite('ChangedFileListParser', () => {

    test('it parses multiple change entries', () => {
        const parser = new ChangedFileListParser();
        const gitOutput = [
            'M\tFILE_NAME_1',
            'M\tFILE_NAME_2'
        ].join('\n');
        expect(parser.parse(gitOutput)).to.eql([
            {changeType: 'M', path: 'FILE_NAME_1', previousPath: 'FILE_NAME_1'},
            {changeType: 'M', path: 'FILE_NAME_2', previousPath: 'FILE_NAME_2'}
        ]);
    });

    test('it parses file modification entry', () => {
        const parser = new ChangedFileListParser();
        const gitOutput = 'M\tFILE_NAME';
        expect(parser.parse(gitOutput)).to.eql([
            {changeType: 'M', path: 'FILE_NAME', previousPath: 'FILE_NAME'}
        ]);
    });

    test('it parses file addition entry', () => {
        const parser = new ChangedFileListParser();
        const gitOutput = 'A\tFILE_NAME';
        expect(parser.parse(gitOutput)).to.eql([
            {changeType: 'A', path: 'FILE_NAME', previousPath: null}
        ]);
    });

    test('it parses file deletion entry', () => {
        const parser = new ChangedFileListParser();
        const gitOutput = 'D\tFILE_NAME';
        expect(parser.parse(gitOutput)).to.eql([
            {changeType: 'D', path: null, previousPath: 'FILE_NAME'}
        ]);
    });

    test('it parses file rename entry', () => {
        const parser = new ChangedFileListParser();
        const gitOutput = 'R100\tFILE_NAME_1\tFILE_NAME_2';
        expect(parser.parse(gitOutput)).to.eql([
            {changeType: 'R', path: 'FILE_NAME_2', previousPath: 'FILE_NAME_1'}
        ]);
    });

    test('it parses file unmerged entry', () => {
        const parser = new ChangedFileListParser();
        const gitOutput = 'U\tFILE_NAME';
        expect(parser.parse(gitOutput)).to.eql([
            {changeType: 'U', path: 'FILE_NAME', previousPath: 'FILE_NAME'}
        ]);
    });

    test('it parses file type change entry', () => {
        const parser = new ChangedFileListParser();
        const gitOutput = 'T\tFILE_NAME';
        expect(parser.parse(gitOutput)).to.eql([
            {changeType: 'T', path: 'FILE_NAME', previousPath: 'FILE_NAME'}
        ]);
    });

    test('it parses unknown change entry', () => {
        const parser = new ChangedFileListParser();
        const gitOutput = 'X\tFILE_NAME';
        expect(parser.parse(gitOutput)).to.eql([
            {changeType: 'X', path: 'FILE_NAME', previousPath: 'FILE_NAME'}
        ]);
    });

    test('it raises an error if it gets an entry of none of above', () => {
        const parser = new ChangedFileListParser();
        const gitOutput = '_INVALID';
        expect(() => parser.parse(gitOutput)).to.throws('There should have been a change type');
    });

    test('it trims heading/trailing whitespace characters in the git output', () => {
        const parser = new ChangedFileListParser();
        const gitOutput = '\nM\tFILE_NAME\n';
        expect(parser.parse(gitOutput)).to.eql([
            {changeType: 'M', path: 'FILE_NAME', previousPath: 'FILE_NAME'}
        ]);
    });
});
