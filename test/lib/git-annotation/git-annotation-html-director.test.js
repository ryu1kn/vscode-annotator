
const GitAnnotationHtmlDirector = require('../../../lib/git-annotation/git-annotation-html-director');

suite('GitAnnotationHtmlDirector', () => {

    test('it builds the HTML document of an annotation view', () => {
        const annotationScriptProvider = {provide: () => 'SCRIPT'};
        const annotationStyleBuilder = {build: () => 'CSS'};
        const gitAnnotationHtmlBodyGenerator = {generate: sinon.stub().returns('BODY')};
        const gitAnnotationHtmlBuilder = {
            addCss: sinon.spy(),
            addScript: sinon.spy(),
            addSafeBody: sinon.spy(),
            getHtml: () => 'HTML'
        };
        const director = new GitAnnotationHtmlDirector({
            annotationStyleBuilder,
            annotationScriptProvider,
            gitAnnotationHtmlBodyGenerator,
            gitAnnotationHtmlBuilder
        });

        expect(director.construct('LINE_BLAME', 'REPOSITORY_ROOT')).to.be.eql('HTML');
        expect(gitAnnotationHtmlBuilder.addCss).to.have.been.calledWith('CSS');
        expect(gitAnnotationHtmlBuilder.addScript).to.have.been.calledWith('SCRIPT');
        expect(gitAnnotationHtmlBuilder.addSafeBody).to.have.been.calledWith('BODY');
        expect(gitAnnotationHtmlBodyGenerator.generate).to.have.been.calledWith('LINE_BLAME', 'REPOSITORY_ROOT');
    });
});
