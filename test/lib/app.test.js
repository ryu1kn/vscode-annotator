
const App = require('../../lib/app');

suite('App', () => {

    suite('#annotate', () => {

        test("it displays a given file's annotation as HTML", () => {
            const logger = getLogger();
            const uriService = {encodeAnnotateFileAction: sinon.stub().returns('URI')};
            const commands = {executeCommand: sinon.stub().returns(Promise.resolve())};
            const app = new App({commands, logger, uriService});
            const editor = {
                document: {
                    uri: {fsPath: 'PATH'},
                    fileName: 'FILENAME'
                }
            };
            return app.annotate(editor).then(() => {
                expect(uriService.encodeAnnotateFileAction).to.have.been.calledWith({path: 'PATH'});
                expect(commands.executeCommand).to.have.been.calledWith('vscode.previewHtml', 'URI', undefined, 'annotation: FILENAME');
            });
        });

        test('it logs an error', () => {
            const uriService = {encodeAnnotateFileAction: sinon.stub().throws(new Error('ENCODE_ERROR'))};
            const logger = {error: sinon.spy()};
            const editor = {document: {uri: {fsPath: 'PATH'}}};
            const app = new App({logger, uriService});
            return app.annotate(editor).then(() => {
                expect(logger.error.args[0][0]).to.have.string('Error: ENCODE_ERROR');
            });
        });
    });

    suite('#takeDiff', () => {

        test('it displays a diff of 2 files', () => {
            const logger = getLogger();
            const uriService = {encodeShowFileAction: stubReturns('URI_1', 'URI_2')};
            const commands = {executeCommand: sinon.stub().returns(Promise.resolve())};
            const app = new App({commands, logger, uriService});
            const lineBlame = {
                commitHash: 'COMMIT',
                filename: 'FILENAME',
                previousCommitHash: 'PREVIOUS_COMMIT',
                previousFilename: 'PREVIOUS_FILENAME'
            };
            return app.takeDiff(lineBlame, 'REPOSITORY_ROOT').then(() => {
                expect(commands.executeCommand).to.have.been.calledWith('vscode.diff', 'URI_1', 'URI_2', 'FILENAME@COMMIT');
                expect(uriService.encodeShowFileAction.args[0]).to.eql([{
                    commitHash: 'PREVIOUS_COMMIT',
                    path: 'PREVIOUS_FILENAME',
                    repositoryRoot: 'REPOSITORY_ROOT'
                }]);
                expect(uriService.encodeShowFileAction.args[1]).to.eql([{
                    commitHash: 'COMMIT',
                    path: 'FILENAME',
                    repositoryRoot: 'REPOSITORY_ROOT'
                }]);
            });
        });

        test('it points to an empty file if filePath is not given', () => {
            const logger = getLogger();
            const uriService = {
                encodeShowEmptyFileAction: sinon.stub().returns('URI_1'),
                encodeShowFileAction: sinon.stub().returns('URI_2')
            };
            const commands = {executeCommand: sinon.stub().returns(Promise.resolve())};
            const app = new App({commands, logger, uriService});
            const lineBlame = {
                commitHash: 'COMMIT',
                filename: 'FILENAME'
            };
            return app.takeDiff(lineBlame, 'REPOSITORY_ROOT').then(() => {
                expect(commands.executeCommand).to.have.been.calledWith('vscode.diff', 'URI_1', 'URI_2', 'FILENAME@COMMIT');
                expect(uriService.encodeShowFileAction.args).to.eql([[{
                    commitHash: 'COMMIT',
                    path: 'FILENAME',
                    repositoryRoot: 'REPOSITORY_ROOT'
                }]]);
                expect(uriService.encodeShowEmptyFileAction.args).to.eql([[]]);
            });
        });

        test('it logs an error', () => {
            const uriService = {encodeShowFileAction: sinon.stub().throws(new Error('ENCODE_ERROR'))};
            const logger = {error: sinon.spy()};
            const app = new App({uriService, logger});
            const lineBlame = {
                commitHash: 'COMMIT',
                filename: 'FILENAME',
                previousCommitHash: 'PREVIOUS_COMMIT',
                previousFilename: 'PREVIOUS_FILENAME'
            };
            return app.takeDiff(lineBlame, 'REPOSITORY_ROOT').then(() => {
                expect(logger.error.args[0][0]).to.have.string('Error: ENCODE_ERROR');
            });
        });
    });

    function getLogger() {
        return console;
    }
});
