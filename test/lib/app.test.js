
const App = require('../../lib/app');

suite('App', () => {

    suite('#annotate', () => {

        test("it displays a given file's annotation as HTML", () => {
            return setupApp((app, dependencies) => {
                const editor = {document: {uri: {path: 'PATH'}}};
                return app.annotate(editor).then(() => {
                    expect(dependencies.gitAnnotationLoader.load).to.have.been.calledWith('PATH');
                    expect(dependencies.annotationData.set).to.have.been.calledWith('BLAME');
                    expect(dependencies.vscode.commands.executeCommand).to.have.been.calledWith('vscode.previewHtml', 'URI');
                });
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
            return setupApp((app, dependencies) => {
                return app.annotateAt('PATH', 'COMMIT').then(() => {
                    expect(dependencies.gitAnnotationLoader.load).to.have.been.calledWith('PATH', 'COMMIT');
                    expect(dependencies.annotationData.set).to.have.been.calledWith('BLAME');
                    expect(dependencies.vscode.commands.executeCommand).to.have.been.calledWith('vscode.previewHtml', 'URI');
                });
            });
        });

        test('it logs an error', () => {
            const gitAnnotationLoader = {load: sinon.stub().throws(new Error('LOAD_ERROR'))};
            const logger = {error: sinon.spy()};
            const app = new App({gitAnnotationLoader, logger});
            return app.annotateAt('PATH', 'COMMIT').then(() => {
                expect(logger.error.args[0][0]).to.have.string('Error: LOAD_ERROR');
            });
        });
    });

    function setupApp(callback) {
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
        const dependencies = {annotationData, gitAnnotationLoader, vscode, logger};
        return callback(new App(dependencies), dependencies);
    }

    function getLogger() {
        return console;
    }
});
