
const GitBlameOutputParser = require('../../lib/git-blame-output-parser');

suite('GitBlameOutputParser', () => {

    test('it can parse git porcelain output', () => {
        const gitBlameOutputParser = new GitBlameOutputParser();
        const gitOutput = [
            '3d08763c287388a5e4b125a53bbe53a4bf5d0401 23 23',
            'author AUTHOR',
            'author-mail <AUTHOR_MAIL@EXAMPLE.COM>',
            'author-time 1465725065',
            'author-tz +1000',
            'committer COMMITTER',
            'committer-mail <COMMITTER_MAIL@EXAMPLE.COM>',
            'committer-time 1465725065',
            'committer-tz +1000',
            'summary Use test/bootstrap.js to put test related global variables',
            'previous 0767f59336f8f3519b95f3e076204d9b6130e58a test/index.js',
            'filename test/index.js',
            '\t',
            '3d08763c287388a5e4b125a53bbe53a4bf5d0401 24 24',
            'author AUTHOR',
            'author-mail <AUTHOR_MAIL@EXAMPLE.COM>',
            'author-time 1465725065',
            'author-tz +1000',
            'committer COMMITTER',
            'committer-mail <COMMITTER_MAIL@EXAMPLE.COM>',
            'committer-time 1465725065',
            'committer-tz +1000',
            'summary Use test/bootstrap.js to put test related global variables',
            'previous 0767f59336f8f3519b95f3e076204d9b6130e58a test/index.js',
            'filename test/index.js',
            '\tmodule.exports = testRunner;\n'
        ].join('\n');
        expect(gitBlameOutputParser.parse(gitOutput)).to.eql([
            {
                commitHash: '3d08763c287388a5e4b125a53bbe53a4bf5d0401',
                lineNoInOriginalFile: 23,
                lineNoInFinalFile: 23,
                authorName: 'AUTHOR',
                authorMail: '<AUTHOR_MAIL@EXAMPLE.COM>',
                authorTime: 1465725065,
                authorTz: '+1000',
                committerName: 'COMMITTER',
                committerMail: '<COMMITTER_MAIL@EXAMPLE.COM>',
                committerTime: 1465725065,
                committerTz: '+1000',
                subject: 'Use test/bootstrap.js to put test related global variables',
                previousCommitHash: '0767f59336f8f3519b95f3e076204d9b6130e58a',
                previousFilename: 'test/index.js',
                filename: 'test/index.js',
                lineContents: ''
            },
            {
                commitHash: '3d08763c287388a5e4b125a53bbe53a4bf5d0401',
                lineNoInOriginalFile: 24,
                lineNoInFinalFile: 24,
                authorName: 'AUTHOR',
                authorMail: '<AUTHOR_MAIL@EXAMPLE.COM>',
                authorTime: 1465725065,
                authorTz: '+1000',
                committerName: 'COMMITTER',
                committerMail: '<COMMITTER_MAIL@EXAMPLE.COM>',
                committerTime: 1465725065,
                committerTz: '+1000',
                subject: 'Use test/bootstrap.js to put test related global variables',
                previousCommitHash: '0767f59336f8f3519b95f3e076204d9b6130e58a',
                previousFilename: 'test/index.js',
                filename: 'test/index.js',
                lineContents: 'module.exports = testRunner;'
            }
        ]);
    });
});
