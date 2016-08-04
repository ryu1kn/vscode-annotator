
const TakeDiffCommand = require('../../../lib/command/take-diff');

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
            expect(uriService.encodeShowFileAction.args[0]).to.eql([{
                commitHash: 'PREVIOUS_COMMIT',
                path: 'PREVIOUS_FILENAME',
                repositoryRoot: 'REPOSITORY_ROOT'
            }]);
            expect(uriService.encodeShowFileAction.args[1]).to.eql([{
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
            expect(uriService.encodeShowFileAction.args).to.eql([
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
        return command.execute(lineBlame, 'REPOSITORY_ROOT').then(() => {
            expect(logger.error.args[0][0]).to.have.string('Error: ENCODE_ERROR');
        });
    });

    function getLogger() {
        return console;
    }
});

