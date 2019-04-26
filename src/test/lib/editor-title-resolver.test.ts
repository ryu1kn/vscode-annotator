import {EditorTitleResolver} from '../../lib/editor-title-resolver';
import {expect} from '../helper/assert';

const querystring = require('querystring');

suite('EditorTitleResolver', () => {

    test('it composes a title for an annotation view from path and commitHash', () => {
        const workspaceRoot = '/PATH/TO/WORKSPACE';
        const titleResolver = new EditorTitleResolver({workspaceRoot});
        const queryParams = {
            path: '/PATH/TO/WORKSPACE/DIR/FILE',
            commitHash: 'COMMIT_HASH'
        };
        const uri = {
            scheme: 'annotator',
            path: 'annotate-file',
            query: querystring.stringify(queryParams)
        };
        expect(titleResolver.resolve(uri)).to.eql('FILE@COMMIT_ \u2013 DIR');
    });

    test('it does not use a commit hash if it is not given', () => {
        const workspaceRoot = '/PATH/TO/WORKSPACE';
        const titleResolver = new EditorTitleResolver({workspaceRoot});
        const queryParams = {path: '/PATH/TO/WORKSPACE/DIR/FILE'};
        const uri = {
            scheme: 'annotator',
            path: 'annotate-file',
            query: querystring.stringify(queryParams)
        };
        expect(titleResolver.resolve(uri)).to.eql('FILE \u2013 DIR');
    });

    test('it does not show directory path if the file is at the workspace root', () => {
        const workspaceRoot = '/PATH/TO/WORKSPACE';
        const titleResolver = new EditorTitleResolver({workspaceRoot});
        const queryParams = {path: '/PATH/TO/WORKSPACE/FILE'};
        const uri = {
            scheme: 'annotator',
            path: 'annotate-file',
            query: querystring.stringify(queryParams)
        };
        expect(titleResolver.resolve(uri)).to.eql('FILE');
    });

    test('it shows absolute directory path if workspace is not available', () => {
        const titleResolver = new EditorTitleResolver({});
        const queryParams = {path: '/PATH/TO/FILE'};
        const uri = {
            scheme: 'annotator',
            path: 'annotate-file',
            query: querystring.stringify(queryParams)
        };
        expect(titleResolver.resolve(uri)).to.eql('FILE \u2013 /PATH/TO');
    });

    test('it shows absolute directory path if file is outside of workspace', () => {
        const workspaceRoot = '/PATH/TO/WORKSPACE';
        const titleResolver = new EditorTitleResolver({workspaceRoot});
        const queryParams = {path: '/PATH/OUTSIDE_WS/FILE'};
        const uri = {
            scheme: 'annotator',
            path: 'annotate-file',
            query: querystring.stringify(queryParams)
        };
        expect(titleResolver.resolve(uri)).to.eql('FILE \u2013 /PATH/OUTSIDE_WS');
    });

    test('it shows absolute directory path if file is outside of workspace', () => {
        const workspaceRoot = '/PATH/TO/WORKSPACE';
        const titleResolver = new EditorTitleResolver({workspaceRoot});
        const queryParams = {
            path: 'FILE',
            repositoryRoot: '/PATH/OUTSIDE_WS'
        };
        const uri = {
            scheme: 'annotator',
            path: 'annotate-file',
            query: querystring.stringify(queryParams)
        };
        expect(titleResolver.resolve(uri)).to.eql('FILE \u2013 /PATH/OUTSIDE_WS');
    });

    test('it composes a title for a diff view from path and commitHash', () => {
        const workspaceRoot = '/PATH/TO/WORKSPACE';
        const titleResolver = new EditorTitleResolver({workspaceRoot});
        const queryParams = {
            path: 'DIR2/FILE',
            commitHash: 'COMMIT_HASH',
            repositoryRoot: '/PATH/TO/WORKSPACE/DIR1'
        };
        const uri = {
            scheme: 'annotator',
            path: 'show-file',
            query: querystring.stringify(queryParams)
        };
        expect(titleResolver.resolve(uri)).to.eql('FILE@COMMIT_ \u2013 DIR1/DIR2');
    });

    test('it composes a title for a deleted file diff view', () => {
        const workspaceRoot = '/PATH/TO/WORKSPACE';
        const titleResolver = new EditorTitleResolver({workspaceRoot});
        const queryParams = {
            previousPath: 'DIR2/PREVIOUS_FILE',
            commitHash: 'COMMIT_HASH',
            repositoryRoot: '/PATH/TO/WORKSPACE/DIR1'
        };
        const uri = {
            scheme: 'annotator',
            path: 'show-file',
            query: querystring.stringify(queryParams)
        };
        expect(titleResolver.resolve(uri)).to.eql('PREVIOUS_FILE@COMMIT_ \u2013 DIR1/DIR2');
    });
});
