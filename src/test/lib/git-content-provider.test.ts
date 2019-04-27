import {GitContentProvider} from '../../lib/git-content-provider';
import {stubWithArgs} from '../helper/assert';
import {strictEqual} from 'assert';

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
            strictEqual(document, 'ANNOTATION_DOCUMENT');
        });
    });

    test('it retrieves the file contents of specified commit', () => {
        const gitService = {
            getFileContents: stubWithArgs(
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
            strictEqual(document, 'FILE_CONTENTS');
        });
    });

    test('it returns an empty string if it is requested an empty file', async () => {
        const contentProvider = new GitContentProvider({uriService: fakeUriService()});
        const uri = {path: 'show-file', query: 'repositoryRoot=REPOSITORY_ROOT'};
        const document = await contentProvider.provideTextDocumentContent(uri);
        strictEqual(document, '');
    });

    test('it throws exception if unknown action is provided in the uri', () => {
        const contentProvider = new GitContentProvider({uriService: fakeUriService()});
        const uri = {path: 'UNKOWN_ACTION'};
        return contentProvider.provideTextDocumentContent(uri).then(
            () => { throw new Error('Should not have been called'); },
            e => {
                strictEqual(e.message, 'Unknown action');
            }
        );
    });

    function fakeUriService() {
        return {
            getAction: uri => uri.path.split('/')[0]
        };
    }
});
