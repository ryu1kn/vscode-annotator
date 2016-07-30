
const GitContentProvider = require('../../lib/git-content-provider');
const querystring = require('querystring');

suite('GitContentProvider', () => {

    test('it retrieves annotation data and compose annotation document', () => {
        const actionParams = {
            path: 'PATH',
            repositoryRoot: 'REPOSITORY_ROOT'
        };
        const uriService = fakeUriService();
        const gitAnnotationContentGenerator = {
            generate: stubWithArgs([actionParams], Promise.resolve('ANNOTATION_DOCUMENT'))
        };
        const contentProvider = new GitContentProvider({gitAnnotationContentGenerator, uriService});

        const uri = {
            path: 'annotate-file',
            query: querystring.stringify(actionParams)
        };
        return contentProvider.provideTextDocumentContent(uri).then(document => {
            expect(document).to.eql('ANNOTATION_DOCUMENT');
        });
    });

    test('it retrieves the file contents of specified commit', () => {
        const gitService = {
            show: stubWithArgs(
                ['COMMIT', '/DIR/FILE.js', 'REPOSITORY_ROOT'],
                Promise.resolve('FILE_CONTENTS')
            )
        };
        const uriService = fakeUriService();
        const contentProvider = new GitContentProvider({gitService, uriService});
        const uri = {
            path: 'show-file/FILE.js',
            query: 'repositoryRoot=REPOSITORY_ROOT&commitHash=COMMIT&path=%2FDIR%2FFILE.js'
        };
        return contentProvider.provideTextDocumentContent(uri).then(document => {
            expect(document).to.eql('FILE_CONTENTS');
        });
    });

    test('it returns an empty string if it is requested an empty file', () => {
        const contentProvider = new GitContentProvider({uriService: fakeUriService()});
        const uri = {path: 'show-emptyfile'};
        const document = contentProvider.provideTextDocumentContent(uri);
        expect(document).to.eql('');
    });

    test('it throws exception if unknown action is provided in the uri', () => {
        const contentProvider = new GitContentProvider({uriService: fakeUriService()});
        const uri = {path: 'UNKOWN_ACTION'};
        expect(() => {
            contentProvider.provideTextDocumentContent(uri);
        }).to.throw(Error, 'Unknown action');
    });

    function fakeUriService() {
        return {
            getAction: uri => uri.path.split('/')[0]
        };
    }
});
