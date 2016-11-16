
const GitAnnotationLineValues = require('../../../lib/git-annotation/git-annotation-line-values');

suite('GitAnnotationLineValues', () => {

    test('it composes details of the commit', () => {
        const lineBlame = {
            commitHash: 'COMMIT_HASH',
            authorTime: 1465725065,
            authorName: 'AUTHOR_NAME',
            subject: 'SUBJECT'
        };
        const line = new GitAnnotationLineValues({lineBlame, formatDateTime});
        expect(line.details).to.eql('Commit: COMMIT_HASH\nAuthor: AUTHOR_NAME\nDate: 2016-06-12 19:51:05\n\nSUBJECT');
    });

    test('it indicates that the line is committed', () => {
        const lineBlame = {commitHash: '0000000000000000000000000000000000000000'};
        const line = new GitAnnotationLineValues({lineBlame});
        expect(line.isCommitted).to.be.false;
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
        expect(line.caption).to.eql('1  2016-06-12 AUTHOR_NAME');
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
        expect(line.caption).to.eql('  1  2016-06-12 AUTHOR_NAME');
    });

    test('it just gives padded line number if the line is not yet committed', () => {
        const lineBlame = {commitHash: '0000000000000000000000000000000000000000'};
        const params = {
            lineBlame,
            lineNumber: 1,
            lineNumberWidth: 3
        };
        const line = new GitAnnotationLineValues(params);
        expect(line.caption).to.eql('  1');
    });

    test('it returns contents of the line of the commit', () => {
        const lineBlame = {lineContents: 'LINE_CONTENTS'};
        const line = new GitAnnotationLineValues({lineBlame});
        expect(line.lineContents).to.eql('LINE_CONTENTS');
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

    test('it does not give command if the line is not yet committed', () => {
        const lineBlame = {commitHash: '0000000000000000000000000000000000000000'};
        const line = new GitAnnotationLineValues({
            lineBlame,
            repositoryRoot: 'REPOSITORY_ROOT'
        });
        expect(line.command).to.eql(null);
    });

    test('it returns commit hash of the line of the commit', () => {
        const lineBlame = {commitHash: 'COMMIT_HASH'};
        const line = new GitAnnotationLineValues({lineBlame});
        expect(line.commitHash).to.eql('COMMIT_HASH');
    });

    function formatDateTime(date) {
        const pad0 = n => n < 10 ? `0${n}` : n;
        const dateString = date.toLocaleString('en-AU', {timeZone: 'Australia/Melbourne', hour12: false});
        return dateString.replace(
            /^(\d{1,2})\/(\d{1,2})\/(\d{4}), (\d{2}):(\d{2}):(\d{2})$/,
            (_match, month, date, year, hour, minutes, seconds) => {
                const dateString = [year, month, date].map(pad0).join('-');
                const timeString = [hour, minutes, seconds].join(':');
                return `${dateString} ${timeString}`;
            }
        );
    }
});
