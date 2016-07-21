
const GitAnnotationDocumentBuilder = require('../../../lib/git-annotation/git-annotation-document-builder');

suite('GitAnnotationDocumentBuilder', () => {

    test('it composes annotation HTML document from given annotation data', () => {
        const annotationStyleBuilder = {build: () => 'CSS'};
        const gitAnnotationLineDirector = {construct: sinon.stub().returns('LINE_HTML')};
        const gitAnnotationLineDirectorFactory = {create: sinon.stub().returns(gitAnnotationLineDirector)};
        const builder = new GitAnnotationDocumentBuilder({
            annotationStyleBuilder, gitAnnotationLineDirectorFactory
        });
        const lines = [{
            filename: 'FILENAME',
            commitHash: 'COMMIT_HASH',
            authorTime: 1465725065,
            authorName: 'AUTHOR_NAME',
            lineContents: 'LINE_CONTENTS',
            subject: 'SUBJECT'
        }];

        expect(builder.build(lines, 'REPOSITORY_ROOT')).to.eql('<style>CSS</style><body>LINE_HTML</body>');
        expect(gitAnnotationLineDirector.construct).to.have.been.calledWith({
            lineBlame: {
                authorName: 'AUTHOR_NAME',
                authorTime: 1465725065,
                commitHash: 'COMMIT_HASH',
                filename: 'FILENAME',
                lineContents: 'LINE_CONTENTS',
                subject: 'SUBJECT'
            },
            lineNumber: 1,
            lineNumberWidth: 1,
            repositoryRoot: 'REPOSITORY_ROOT'
        });
    });
});
