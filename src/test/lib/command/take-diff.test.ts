import * as sinon from 'sinon';
import {TakeDiffCommand} from '../../../lib/command/take-diff';
import {expect, stubReturns, stubWithArgs} from '../../helper/assert';
import {deepStrictEqual, ok} from 'assert';

suite('TakeDiffCommand', () => {

    test('it displays a diff of 2 files', () => {
        const logger = getLogger();
        const editorTitleResolver = {resolve: stubWithArgs(['URI_AFTER'], 'ANNOTATION_TITLE')};
        const uriService = {
            encodeShowFileAction: stubReturns('URI_BEFORE', 'URI_AFTER')
        };
        const commands = {executeCommand: sinon.spy()};
        const command = new TakeDiffCommand({commands, editorTitleResolver, logger, uriService});
        const lineBlame = {
            commitHash: 'COMMIT',
            path: 'FILENAME',
            previousCommitHash: 'PREVIOUS_COMMIT',
            previousPath: 'PREVIOUS_FILENAME',
            repositoryRoot: 'REPOSITORY_ROOT'
        };
        return command.execute(lineBlame).then(() => {
            expect(commands.executeCommand).to.have.been.calledWith('vscode.diff', 'URI_BEFORE', 'URI_AFTER', 'ANNOTATION_TITLE');
            deepStrictEqual(uriService.encodeShowFileAction.args[0], [{
                commitHash: 'PREVIOUS_COMMIT',
                path: 'PREVIOUS_FILENAME',
                repositoryRoot: 'REPOSITORY_ROOT'
            }]);
            deepStrictEqual(uriService.encodeShowFileAction.args[1], [{
                commitHash: 'COMMIT',
                path: 'FILENAME',
                previousCommitHash: 'PREVIOUS_COMMIT',
                previousPath: 'PREVIOUS_FILENAME',
                repositoryRoot: 'REPOSITORY_ROOT'
            }]);
        });
    });

    test('it points to an empty file if filePath is not given', () => {
        const logger = getLogger();
        const editorTitleResolver = {resolve: stubWithArgs(['URI_2'], 'ANNOTATION_TITLE')};
        const uriService = {encodeShowFileAction: stubReturns('URI_1', 'URI_2')};
        const commands = {executeCommand: sinon.spy()};
        const command = new TakeDiffCommand({commands, editorTitleResolver, logger, uriService});
        const lineBlame = {
            commitHash: 'COMMIT',
            path: 'FILENAME',
            repositoryRoot: 'REPOSITORY_ROOT'
        };
        return command.execute(lineBlame).then(() => {
            expect(commands.executeCommand).to.have.been.calledWith('vscode.diff', 'URI_1', 'URI_2', 'ANNOTATION_TITLE');
            deepStrictEqual(uriService.encodeShowFileAction.args, [
                [{
                    repositoryRoot: 'REPOSITORY_ROOT'
                }],
                [{
                    commitHash: 'COMMIT',
                    path: 'FILENAME',
                    repositoryRoot: 'REPOSITORY_ROOT'
                }]
            ]);
        });
    });

    test('it logs an error', () => {
        const uriService = {encodeShowFileAction: sinon.stub().throws(new Error('ENCODE_ERROR'))};
        const logger = {error: sinon.spy()};
        const command = new TakeDiffCommand({uriService, logger});
        const lineBlame = {
            commitHash: 'COMMIT',
            path: 'FILENAME',
            previousCommitHash: 'PREVIOUS_COMMIT',
            previousPath: 'PREVIOUS_FILENAME'
        };
        return command.execute(lineBlame).then(() => {
            ok(logger.error.args[0][0].includes('Error: ENCODE_ERROR'));
        });
    });

    function getLogger() {
        return console;
    }
});

