import {AnnotateCommand} from '../../../lib/command/annotate';
import {expect, stubWithArgs} from '../../helper/assert';
import * as sinon from 'sinon';

suite('#AnnotateCommand', () => {

    test("it displays a given file's annotation as HTML", () => {
        const logger = getLogger();
        const editorTitleResolver = {resolve: stubWithArgs(['ANNOTATE_FILE_URI'], 'ANNOTATION_TITLE')};
        const uriService = {
            convertToAnnotateFileAction: sinon.stub().returns('ANNOTATE_FILE_URI')
        };
        const vscode = getVscode();
        const command = new AnnotateCommand({vscode, editorTitleResolver, logger, uriService});
        const editor = {
            document: {uri: 'URI', fileName: 'FILENAME'}
        };
        return command.execute(editor).then(() => {
            expect(uriService.convertToAnnotateFileAction).to.have.been.calledWith('URI');
            expect(vscode.window.createWebviewPanel).to.have.been.calledWith(
                'annotator-annotation', 'ANNOTATION_TITLE', 'active', {enableScripts: true}
            );
        });
    });

    test('does nothing if annotation should not be available', () => {
        const logger = getLogger();
        const uriService = {
            convertToAnnotateFileAction: sinon.stub().returns(null)
        };
        const vscode = getVscode();
        const command = new AnnotateCommand({vscode, logger, uriService});
        const editor = {
            document: {uri: 'URI', fileName: 'FILENAME'}
        };
        return command.execute(editor).then(() => {
            expect(vscode.window.createWebviewPanel).to.have.been.not.called;
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

    function getVscode() {
        return {
            ViewColumn: {Active: 'active'},
            window: {
                createWebviewPanel: sinon.spy()
            }
        };
    }
});
