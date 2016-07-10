
const App = require('../../lib/app');

suite('App', () => {

    suite('#annotate', () => {

        test("it displays a given file's annotation as HTML", () => {
            const logger = getLogger();
            const Uri = {parse: sinon.stub().returns('URI')};
            const commands = {executeCommand: sinon.stub().returns(Promise.resolve())};
            const annotaion = {
                lines: 'BLAME',
                repositoryRootPath: 'REPOSITORY_ROOT'
            };
            const annotationData = {set: sinon.spy()};
            const getCurrentDateFn = () => 'DATE';
            const gitAnnotationLoader = {load: sinon.stub().returns(Promise.resolve(annotaion))};
            const app = new App({Uri, annotationData, commands, getCurrentDateFn, gitAnnotationLoader, logger});
            const editor = {document: {uri: {path: 'PATH'}}};
            return app.annotate(editor).then(() => {
                expect(gitAnnotationLoader.load).to.have.been.calledWith('PATH');
                expect(annotationData.set).to.have.been.calledWith('BLAME');
                expect(Uri.parse).to.have.been.calledWith('annotation:/annotation?repositoryRoot=REPOSITORY_ROOT&_ts=DATE');
                expect(commands.executeCommand).to.have.been.calledWith('vscode.previewHtml', 'URI');
            });
        });

        test('it logs an error', () => {
            const gitAnnotationLoader = {load: sinon.stub().throws(new Error('LOAD_ERROR'))};
            const logger = {error: sinon.spy()};
            const editor = {document: {uri: {path: 'PATH'}}};
            const app = new App({gitAnnotationLoader, logger});
            return app.annotate(editor).then(() => {
                expect(logger.error.args[0][0]).to.have.string('Error: LOAD_ERROR');
            });
        });
    });

    suite('#takeDiff', () => {

        test('it displays a diff of 2 files', () => {
            const logger = getLogger();
            const Uri = {parse: stubReturns('URI_1', 'URI_2')};
            const commands = {executeCommand: sinon.stub().returns(Promise.resolve())};
            const app = new App({Uri, commands, logger});
            const lineBlame = {
                commitHash: 'COMMIT',
                filename: 'FILENAME',
                previousCommitHash: 'PREVIOUS_COMMIT',
                previousFilename: 'PREVIOUS_FILENAME'
            };
            return app.takeDiff(lineBlame, 'REPOSITORY_ROOT').then(() => {
                expect(commands.executeCommand).to.have.been.calledWith('vscode.diff', 'URI_1', 'URI_2');
                expect(Uri.parse.args[0]).to.eql(['annotation:/file/PREVIOUS_FILENAME?commit=PREVIOUS_COMMIT&repositoryRoot=REPOSITORY_ROOT']);
                expect(Uri.parse.args[1]).to.eql(['annotation:/file/FILENAME?commit=COMMIT&repositoryRoot=REPOSITORY_ROOT']);
            });
        });

        test('it logs an error', () => {
            const Uri = {parse: sinon.stub().throws(new Error('PARSE_ERROR'))};
            const logger = {error: sinon.spy()};
            const app = new App({Uri, logger});
            const lineBlame = {
                commitHash: 'COMMIT',
                filename: 'FILENAME',
                previousCommitHash: 'PREVIOUS_COMMIT',
                previousFilename: 'PREVIOUS_FILENAME'
            };
            return app.takeDiff(lineBlame, 'REPOSITORY_ROOT').then(() => {
                expect(logger.error.args[0][0]).to.have.string('Error: PARSE_ERROR');
            });
        });
    });

    function getLogger() {
        return console;
    }
});
