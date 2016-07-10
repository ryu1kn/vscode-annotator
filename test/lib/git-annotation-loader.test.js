
const GitAnnotationLoader = require('../../lib/git-annotation-loader');

suite('GitAnnotationLoader', () => {

    test('it loads git annotation for all lines in the given file', () => {
        const gitCommand = {
            blame: stubWithArgs(['PATH', 'HEAD', 'ROOT_PATH'], Promise.resolve('ANNOTATION_STRING')),
            getRepositoryRoot: stubWithArgs(['PATH'], Promise.resolve('ROOT_PATH\n'))
        };
        const gitBlameOutputParser = {
            parse: stubWithArgs(['ANNOTATION_STRING'], 'ANNOTATION_LIST')
        };
        const gitAnnotationLoader = new GitAnnotationLoader({gitCommand, gitBlameOutputParser});

        return gitAnnotationLoader.load('PATH').then(result => {
            expect(result).to.eql({
                lines: 'ANNOTATION_LIST',
                repositoryRootPath: 'ROOT_PATH'
            });
        });
    });

    test('it loads git annotation at a specific commit', () => {
        const gitCommand = {
            blame: stubWithArgs(['PATH', 'COMMIT', 'ROOT_PATH'], Promise.resolve('ANNOTATION_STRING')),
            getRepositoryRoot: stubWithArgs(['PATH'], Promise.resolve('ROOT_PATH\n'))
        };
        const gitBlameOutputParser = {
            parse: stubWithArgs(['ANNOTATION_STRING'], 'ANNOTATION_LIST')
        };
        const gitAnnotationLoader = new GitAnnotationLoader({gitCommand, gitBlameOutputParser});

        return gitAnnotationLoader.loadAt('COMMIT', 'PATH', 'ROOT_PATH').then(result => {
            expect(result).to.eql('ANNOTATION_LIST');
        });
    });

    test('it does not try to parse git result if command failed', () => {
        const gitCommand = {
            blame: sinon.stub().returns(Promise.reject(new Error('BLAME_ERROR'))),
            getRepositoryRoot: stubWithArgs(['PATH'], Promise.resolve('ROOT_PATH\n'))
        };
        const gitBlameOutputParser = {parse: sinon.spy()};
        const gitAnnotationLoader = new GitAnnotationLoader({gitCommand, gitBlameOutputParser});

        return gitAnnotationLoader.loadAt('PATH').then(
            throwError,
            e => {
                expect(e).to.be.an('error');
                expect(e.message).to.eql('BLAME_ERROR');
            }
        );
    });
});
