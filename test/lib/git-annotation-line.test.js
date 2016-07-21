
const GitAnnotationLine = require('../../lib/git-annotation-line');

suite('GitAnnotationLine', () => {

    test('it composes details of the commit', () => {
        const lineData = {
            commitHash: 'COMMIT_HASH',
            authorTime: 1465725065,
            authorName: 'AUTHOR_NAME',
            subject: 'SUBJECT'
        };
        const line = new GitAnnotationLine({lineData});
        expect(line.details).to.eql('Commit: COMMIT_HASH\nAuthor: AUTHOR_NAME\nDate: 2016-06-12 19:51:05\n\nSUBJECT');
    });

    test('it indicates that the line is committed', () => {
        const lineData = {commitHash: '0000000000000000000000000000000000000000'};
        const line = new GitAnnotationLine({lineData});
        expect(line.isCommitted).to.be.false;
    });

    test('it composes the caption of the commit', () => {
        const lineData = {
            commitHash: 'COMMIT_HASH',
            authorTime: 1465725065,
            authorName: 'AUTHOR_NAME'
        };
        const params = {
            lineData,
            lineNumber: 1,
            maxLineNumber: 1
        };
        const line = new GitAnnotationLine(params);
        expect(line.caption).to.eql('1  COMMIT_ 2016-06-12 AUTHOR_NAME');
    });

    test('it gives padding for the line number', () => {
        const lineData = {
            commitHash: 'COMMIT_HASH',
            authorTime: 1465725065,
            authorName: 'AUTHOR_NAME'
        };
        const params = {
            lineData,
            lineNumber: 1,
            lineNumberWidth: 3
        };
        const line = new GitAnnotationLine(params);
        expect(line.caption).to.eql('  1  COMMIT_ 2016-06-12 AUTHOR_NAME');
    });

    test('it returns contents of the line of the commit', () => {
        const lineData = {lineContents: 'LINE_CONTENTS'};
        const line = new GitAnnotationLine({lineData});
        expect(line.lineContents).to.eql('LINE_CONTENTS');
    });

    test('it returns the command information for opening a diff', () => {
        const lineData = {
            filename: 'FILENAME',
            commitHash: 'COMMIT_HASH',
            previousFilename: 'PREVIOUS_FILENAME',
            previousCommitHash: 'PREVIOUS_COMMIT_HASH'
        };
        const line = new GitAnnotationLine({
            lineData,
            repositoryRoot: 'REPOSITORY_ROOT'
        });
        expect(line.command).to.eql({
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
});
