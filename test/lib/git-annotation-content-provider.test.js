
const GitAnnotationContentProvider = require('../../lib/git-annotation-content-provider');

suite('GitAnnotationContentProvider', () => {

    test('it retrieves annotation data and compose annotation document', () => {
        const annotationData = {get: () => 'ANNOTATION_DATA_BY_LINES'};
        const gitAnnotationContentBuilder = {
            build: stubWithArgs(
                ['ANNOTATION_DATA_BY_LINES', 'REPOSITORY_ROOT'],
                Promise.resolve('ANNOTATION_DOCUMENT')
            )
        };
        const contentProvider = new GitAnnotationContentProvider({
            annotationData, gitAnnotationContentBuilder
        });
        const uri = {query: 'repositoryRoot=REPOSITORY_ROOT'};
        return contentProvider.provideTextDocumentContent(uri).then(document => {
            expect(document).to.eql('ANNOTATION_DOCUMENT');
        });
    });
});
