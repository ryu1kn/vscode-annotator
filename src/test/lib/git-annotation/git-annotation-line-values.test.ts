import {GitAnnotationLineValues} from '../../../lib/git-annotation/git-annotation-line-values';
import {deepStrictEqual, strictEqual} from 'assert';

suite('GitAnnotationLineValues', () => {

    test('it composes details of the commit', () => {
        const lineBlame = {
            commitHash: 'COMMIT_HASH',
            authorTime: 1465725065,
            authorName: 'AUTHOR_NAME',
            subject: 'SUBJECT'
        };
        const line = new GitAnnotationLineValues({
            lineBlame,
            formatDateTime: date => date.toISOString()
        });
        strictEqual(line.details, 'Commit: COMMIT_HASH\nAuthor: AUTHOR_NAME\nDate: 2016-06-12T09:51:05.000Z\n\nSUBJECT');
    });

    test('it indicates that the line is committed', () => {
        const lineBlame = {commitHash: '0000000000000000000000000000000000000000'};
        const line = new GitAnnotationLineValues({lineBlame});
        strictEqual(line.isCommitted, false);
    });

    test('it composes the caption of the commit', () => {
        const lineBlame = {
            authorTime: 1465725065,
            authorName: 'AUTHOR_NAME'
        };
        const params = {
            lineBlame,
            lineNumber: 1,
            lineNumberWidth: 1
        };
        const line = new GitAnnotationLineValues(params);
        strictEqual(line.caption, '1  2016-06-12 AUTHOR_NAME');
    });

    test('it gives padding for the line number', () => {
        const lineBlame = {
            authorTime: 1465725065,
            authorName: 'AUTHOR_NAME'
        };
        const params = {
            lineBlame,
            lineNumber: 1,
            lineNumberWidth: 3
        };
        const line = new GitAnnotationLineValues(params);
        strictEqual(line.caption, '  1  2016-06-12 AUTHOR_NAME');
    });

    test('it just gives padded line number if the line is not yet committed', () => {
        const lineBlame = {commitHash: '0000000000000000000000000000000000000000'};
        const params = {
            lineBlame,
            lineNumber: 1,
            lineNumberWidth: 3
        };
        const line = new GitAnnotationLineValues(params);
        strictEqual(line.caption, '  1');
    });

    test('it returns contents of the line of the commit', () => {
        const lineBlame = {lineContents: 'LINE_CONTENTS'};
        const line = new GitAnnotationLineValues({lineBlame});
        strictEqual(line.lineContents, 'LINE_CONTENTS');
    });

    test('it returns the command information for opening a diff', () => {
        const lineBlame = {
            filename: 'FILENAME',
            commitHash: 'COMMIT_HASH',
            previousFilename: 'PREVIOUS_FILENAME',
            previousCommitHash: 'PREVIOUS_COMMIT_HASH'
        };
        const line = new GitAnnotationLineValues({
            lineBlame,
            repositoryRoot: 'REPOSITORY_ROOT'
        });
        deepStrictEqual(line.command, {
            name: 'annotator.takeDiff',
            args: [
                {
                    commitHash: 'COMMIT_HASH',
                    path: 'FILENAME',
                    previousCommitHash: 'PREVIOUS_COMMIT_HASH',
                    previousPath: 'PREVIOUS_FILENAME',
                    repositoryRoot: 'REPOSITORY_ROOT'
                }
            ]
        });
    });

    test('it does not give command if the line is not yet committed', () => {
        const lineBlame = {commitHash: '0000000000000000000000000000000000000000'};
        const line = new GitAnnotationLineValues({
            lineBlame,
            repositoryRoot: 'REPOSITORY_ROOT'
        });
        strictEqual(line.command, null);
    });

    test('it returns commit hash of the line of the commit', () => {
        const lineBlame = {commitHash: 'COMMIT_HASH'};
        const line = new GitAnnotationLineValues({lineBlame});
        strictEqual(line.commitHash, 'COMMIT_HASH');
    });
});
