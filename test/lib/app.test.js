
const App = require('../../lib/app');

suite('App', () => {

    suite('#annotate', () => {

        test("it displays a given file's annotation as HTML", () => {
            const logger = getLogger();
            const vscode = {
                Uri: {
                    parse: sinon.stub().returns('URI')
                },
                commands: {
                    executeCommand: sinon.stub().returns(Promise.resolve())
                }
            };
            const annotaion = {
                lines: 'BLAME',
                repositoryRootPath: 'REPOSITORY_ROOT'
            };
            const annotationData = {set: sinon.spy()};
            const gitAnnotationLoader = {load: sinon.stub().returns(Promise.resolve(annotaion))};
            const app = new App({annotationData, gitAnnotationLoader, vscode, logger});
            const editor = {document: {uri: {path: 'PATH'}}};
            return app.annotate(editor).then(() => {
                expect(gitAnnotationLoader.load).to.have.been.calledWith('PATH');
                expect(annotationData.set).to.have.been.calledWith('BLAME');
                expect(vscode.commands.executeCommand).to.have.been.calledWith('vscode.previewHtml', 'URI');
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

    suite('#annotateAt', () => {

        test("it displays a given file's annotation the given commit as HTML", () => {
            const logger = getLogger();
            const vscode = {
                Uri: {
                    parse: sinon.stub().returns('URI')
                },
                commands: {
                    executeCommand: sinon.stub().returns(Promise.resolve())
                }
            };
            const annotationData = {set: sinon.spy()};
            const gitAnnotationLoader = {loadAt: sinon.stub().returns(Promise.resolve('BLAME'))};
            const app = new App({annotationData, gitAnnotationLoader, vscode, logger});
            return app.annotateAt('COMMIT', 'PATH', 'REPOSITORY_ROOT').then(() => {
                expect(gitAnnotationLoader.loadAt).to.have.been.calledWith('COMMIT', 'PATH', 'REPOSITORY_ROOT');
                expect(annotationData.set).to.have.been.calledWith('BLAME');
                expect(vscode.commands.executeCommand).to.have.been.calledWith('vscode.previewHtml', 'URI');
            });
        });

        test('it logs an error', () => {
            const gitAnnotationLoader = {loadAt: sinon.stub().throws(new Error('LOAD_ERROR'))};
            const logger = {error: sinon.spy()};
            const app = new App({gitAnnotationLoader, logger});
            return app.annotateAt('PATH', 'COMMIT').then(() => {
                expect(logger.error.args[0][0]).to.have.string('Error: LOAD_ERROR');
            });
        });
    });

    function getLogger() {
        return console;
    }
});
