import {ChangedFileListParser} from '../../lib/changed-file-list-parser';
import {deepStrictEqual, throws} from 'assert';

const multiline = require('multiline-string')();

suite('ChangedFileListParser', () => {
    let parser;

    setup(() => {
        parser = new ChangedFileListParser();
    });

    test('it parses multiple change entries', () => {
        const gitOutput = multiline(`
            COMMIT_HASH PREVIOUS_COMMIT_HASH
            M\tFILE_NAME_1
            M\tFILE_NAME_2`);
        deepStrictEqual(parser.parse(gitOutput), {
            commitHash: 'COMMIT_HASH',
            previousCommitHash: 'PREVIOUS_COMMIT_HASH',
            changedFiles: [
                {changeType: 'M', path: 'FILE_NAME_1', previousPath: 'FILE_NAME_1'},
                {changeType: 'M', path: 'FILE_NAME_2', previousPath: 'FILE_NAME_2'}
            ]
        });
    });

    test('it parses file modification entry', () => {
        const gitOutput = multiline(`
            COMMIT_HASH PREVIOUS_COMMIT_HASH
            M\tFILE_NAME`);
        deepStrictEqual(parser.parse(gitOutput).changedFiles, [
            {changeType: 'M', path: 'FILE_NAME', previousPath: 'FILE_NAME'}
        ]);
    });

    test('it parses file addition entry', () => {
        const gitOutput = multiline(`
            COMMIT_HASH PREVIOUS_COMMIT_HASH
            A\tFILE_NAME`);
        deepStrictEqual(parser.parse(gitOutput).changedFiles, [
            {changeType: 'A', path: 'FILE_NAME', previousPath: null}
        ]);
    });

    test('it parses file deletion entry', () => {
        const gitOutput = multiline(`
            COMMIT_HASH PREVIOUS_COMMIT_HASH
            D\tFILE_NAME`);
        deepStrictEqual(parser.parse(gitOutput).changedFiles, [
            {changeType: 'D', path: null, previousPath: 'FILE_NAME'}
        ]);
    });

    test('it parses file rename entry', () => {
        const gitOutput = multiline(`
            COMMIT_HASH PREVIOUS_COMMIT_HASH
            R100\tFILE_NAME_1\tFILE_NAME_2`);
        deepStrictEqual(parser.parse(gitOutput).changedFiles, [
            {changeType: 'R', path: 'FILE_NAME_2', previousPath: 'FILE_NAME_1'}
        ]);
    });

    test('it parses file unmerged entry', () => {
        const gitOutput = multiline(`
            COMMIT_HASH PREVIOUS_COMMIT_HASH
            U\tFILE_NAME`);
        deepStrictEqual(parser.parse(gitOutput).changedFiles, [
            {changeType: 'U', path: 'FILE_NAME', previousPath: 'FILE_NAME'}
        ]);
    });

    test('it parses file type change entry', () => {
        const gitOutput = multiline(`
            COMMIT_HASH PREVIOUS_COMMIT_HASH
            T\tFILE_NAME`);
        deepStrictEqual(parser.parse(gitOutput).changedFiles, [
            {changeType: 'T', path: 'FILE_NAME', previousPath: 'FILE_NAME'}
        ]);
    });

    test('it parses unknown change entry', () => {
        const gitOutput = multiline(`
            COMMIT_HASH PREVIOUS_COMMIT_HASH
            X\tFILE_NAME`);
        deepStrictEqual(parser.parse(gitOutput).changedFiles, [
            {changeType: 'X', path: 'FILE_NAME', previousPath: 'FILE_NAME'}
        ]);
    });

    test('it raises an error if it gets an entry of none of above', () => {
        const gitOutput = multiline(`
            COMMIT_HASH PREVIOUS_COMMIT_HASH
            _INVALID`);
        throws(() => parser.parse(gitOutput), new Error('There should have been a change type'));
    });

    test('it trims heading/trailing whitespace characters in the git output', () => {
        const gitOutput = multiline(`

            COMMIT_HASH PREVIOUS_COMMIT_HASH
            M\tFILE_NAME
            `);
        deepStrictEqual(parser.parse(gitOutput).changedFiles, [
            {changeType: 'M', path: 'FILE_NAME', previousPath: 'FILE_NAME'}
        ]);
    });
});
