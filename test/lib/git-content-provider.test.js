
const GitContentProvider = require('../../lib/git-content-provider');
const querystring = require('querystring');

suite('GitContentProvider', () => {

    test('it retrieves annotation data and compose annotation document', () => {
        const actionParams = {
            path: 'PATH',
            repositoryRoot: 'REPOSITORY_ROOT'
        };
        const gitAnnotationLoader = {
            load: stubWithArgs([actionParams], Promise.resolve('ANNOTATION_DOCUMENT'))
        };
        const contentProvider = new GitContentProvider({gitAnnotationLoader});

        const uri = {
            path: 'annotate-file',
            query: querystring.stringify(actionParams)
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
        const contentProvider = new GitContentProvider({gitCommand});
        const uri = {
            path: 'show-file',
            query: 'repositoryRoot=REPOSITORY_ROOT&commitHash=COMMIT&path=FILE_PATH'
        };
        return contentProvider.provideTextDocumentContent(uri).then(document => {
            expect(document).to.eql('FILE_CONTENTS');
        });
    });

    test('it returns an empty string if it is requested an empty file', () => {
        const contentProvider = new GitContentProvider({});
        const uri = {path: 'show-emptyfile'};
        const document = contentProvider.provideTextDocumentContent(uri);
        expect(document).to.eql('');
    });

    test('it throws exception if unknown action is provided in the uri', () => {
        const contentProvider = new GitContentProvider({});
        const uri = {path: 'UNKOWN_ACTION'};
        expect(() => {
            contentProvider.provideTextDocumentContent(uri);
        }).to.throw(Error, 'Unknown action');
    });
});
