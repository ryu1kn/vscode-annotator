
const GitAnnotationContentProvider = require('../../lib/git-annotation-content-provider');

suite('GitAnnotationContentProvider', () => {

    test('it retrieves annotation data and compose annotation document', () => {
        const annotationData = {get: () => 'ANNOTATION_DATA_BY_LINES'};
        const gitAnnotationDocumentBuilder = {
            build: stubWithArgs(
                ['ANNOTATION_DATA_BY_LINES', 'REPOSITORY_ROOT'],
                Promise.resolve('ANNOTATION_DOCUMENT')
            )
        };
        const contentProvider = new GitAnnotationContentProvider({
            annotationData, gitAnnotationDocumentBuilder
        });
        const uri = {
            path: '/annotation',
            query: 'repositoryRoot=REPOSITORY_ROOT'
        };
        return contentProvider.provideTextDocumentContent(uri).then(document => {
            expect(document).to.eql('ANNOTATION_DOCUMENT');
        });
    });

    test('it retrieves the file contents of specified commit', () => {
        const gitCommand = {
            show: stubWithArgs(
                ['COMMIT', 'FILE_PATH', 'REPOSITORY_ROOT'],
                Promise.resolve('FILE_CONTENTS')
            )
        };
        const contentProvider = new GitAnnotationContentProvider({gitCommand});
        const uri = {
            path: '/file/FILE_PATH',
            query: 'repositoryRoot=REPOSITORY_ROOT&commit=COMMIT'
        };
        return contentProvider.provideTextDocumentContent(uri).then(document => {
            expect(document).to.eql('FILE_CONTENTS');
        });
    });

    test('it returns an empty string if it is requested an empty file', () => {
        const contentProvider = new GitAnnotationContentProvider({});
        const uri = {path: '/emptyfile'};
        const document = contentProvider.provideTextDocumentContent(uri);
        expect(document).to.eql('');
    });
});
