
const GitAnnotationLoader = require('../../lib/git-annotation-loader');

suite('GitAnnotationLoader', () => {

    test('it loads git annotation and construct a document', () => {
        const gitCommand = {
            blame: stubWithArgs(['PATH', 'COMMIT_HASH', 'REPOSITORY_ROOT'], Promise.resolve('ANNOTATION_STRING'))
        };
        const gitBlameOutputParser = {
            parse: stubWithArgs(['ANNOTATION_STRING'], 'ANNOTATION_LIST')
        };
        const gitAnnotationDocumentBuilder = {
            build: stubWithArgs(['ANNOTATION_LIST', 'REPOSITORY_ROOT'], 'ANNOTATION_DOCUMENT')
        };
        const gitAnnotationLoader = new GitAnnotationLoader({
            gitCommand, gitAnnotationDocumentBuilder, gitBlameOutputParser
        });

        const params = {
            commitHash: 'COMMIT_HASH',
            path: 'PATH',
            repositoryRoot: 'REPOSITORY_ROOT'
        };
        return gitAnnotationLoader.load(params).then(document => {
            expect(document).to.eql('ANNOTATION_DOCUMENT');
        });
    });

    test('it finds repository root path if it is not given', () => {
        const gitCommand = {
            blame: stubWithArgs(['PATH', 'COMMIT_HASH', 'REPOSITORY_ROOT'], Promise.resolve('ANNOTATION_STRING')),
            getRepositoryRoot: stubWithArgs(['PATH'], Promise.resolve('REPOSITORY_ROOT\n'))
        };
        const gitBlameOutputParser = {
            parse: stubWithArgs(['ANNOTATION_STRING'], 'ANNOTATION_LIST')
        };
        const gitAnnotationDocumentBuilder = {
            build: stubWithArgs(['ANNOTATION_LIST', 'REPOSITORY_ROOT'], 'ANNOTATION_DOCUMENT')
        };
        const gitAnnotationLoader = new GitAnnotationLoader({
            gitCommand, gitAnnotationDocumentBuilder, gitBlameOutputParser
        });

        const params = {
            path: 'PATH',
            commitHash: 'COMMIT_HASH'
        };
        return gitAnnotationLoader.load(params).then(document => {
            expect(document).to.eql('ANNOTATION_DOCUMENT');
        });
    });

    test('it does not try to parse git result if command failed', () => {
        const gitCommand = {
            blame: sinon.stub().returns(Promise.reject(new Error('BLAME_ERROR'))),
            getRepositoryRoot: stubWithArgs(['PATH'], Promise.resolve('REPOSITORY_ROOT\n'))
        };
        const gitBlameOutputParser = {parse: sinon.spy()};
        const gitAnnotationLoader = new GitAnnotationLoader({gitCommand, gitBlameOutputParser});

        const params = {path: 'PATH'};
        return gitAnnotationLoader.load(params).then(
            throwError,
            e => {
                expect(e).to.be.an('error');
                expect(e.message).to.eql('BLAME_ERROR');
            }
        );
    });
});
