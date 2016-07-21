
const GitAnnotationLineDirector = require('../../../lib/git-annotation/git-annotation-line-director');

suite('GitAnnotationLineDirector', () => {

    test('it composes a line of HTML annotation view', () => {
        const builder = {
            addDetails: sinon.spy(),
            addCaption: sinon.spy(),
            addCommand: sinon.spy(),
            addLineContents: sinon.spy(),
            getHtml: () => 'LINE_HTML'
        };
        const director = new GitAnnotationLineDirector(builder);
        const params = {
            lineBlame: {
                commitHash: 'COMMIT_HASH',
                authorName: 'AUTHOR_NAME',
                authorTime: 1465725065,
                subject: 'SUBJECT'
            },
            lineNumber: 1,
            lineNumberWidth: 3,
            repositoryRoot: 'REPOSITORY_ROOT'
        };
        expect(director.construct(params)).to.be.eql('LINE_HTML');
        expect(builder.addDetails).to.have.been.calledWith('Commit: COMMIT_HASH\nAuthor: AUTHOR_NAME\nDate: 2016-06-12 19:51:05\n\nSUBJECT');
    });
});
