
const AnnotateCommand = require('../../../lib/command/annotate');

suite('#AnnotateCommand', () => {

    test("it displays a given file's annotation as HTML", () => {
        const logger = getLogger();
        const uriService = {
            convertToAnnotateFileAction: sinon.stub().returns('ANNOTATE_FILE_URI'),
            getTitle: stubWithArgs(['ANNOTATE_FILE_URI', 'annotation: '], 'ANNOTATION_TITLE')
        };
        const commands = {executeCommand: sinon.spy()};
        const command = new AnnotateCommand({commands, logger, uriService});
        const editor = {
            document: {uri: 'URI', fileName: 'FILENAME'}
        };
        return command.execute(editor).then(() => {
            expect(uriService.convertToAnnotateFileAction).to.have.been.calledWith('URI');
            expect(commands.executeCommand).to.have.been.calledWith('vscode.previewHtml', 'ANNOTATE_FILE_URI', undefined, 'ANNOTATION_TITLE');
        });
    });

    test('does nothing if annotation should not be available', () => {
        const logger = getLogger();
        const uriService = {
            convertToAnnotateFileAction: sinon.stub().returns(null)
        };
        const commands = {executeCommand: sinon.spy()};
        const command = new AnnotateCommand({commands, logger, uriService});
        const editor = {
            document: {uri: 'URI', fileName: 'FILENAME'}
        };
        return command.execute(editor).then(() => {
            expect(commands.executeCommand).to.have.been.not.called;
        });
    });

    test('it logs an error', () => {
        const uriService = {convertToAnnotateFileAction: sinon.stub().throws(new Error('ENCODE_ERROR'))};
        const logger = {error: sinon.spy()};
        const editor = {document: {uri: {fsPath: 'PATH'}}};
        const command = new AnnotateCommand({logger, uriService});
        return command.execute(editor).then(() => {
            expect(logger.error.args[0][0]).to.have.string('Error: ENCODE_ERROR');
        });
    });

    function getLogger() {
        return console;
    }
});
