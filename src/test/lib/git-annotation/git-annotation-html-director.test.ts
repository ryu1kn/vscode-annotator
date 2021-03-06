import * as sinon from 'sinon';
import {GitAnnotationHtmlDirector} from '../../../lib/git-annotation/git-annotation-html-director';
import {expect, stubWithArgs} from '../../helper/assert';
import {strictEqual} from 'assert';

suite('GitAnnotationHtmlDirector', () => {

    test('it builds the HTML document of an annotation view', () => {
        const annotationScriptProvider = {provide: () => 'SCRIPT'};
        const annotationStyleBuilder = {build: stubWithArgs(['COLOR_MAP'], 'CSS')};
        const gitAnnotationHtmlBodyGenerator = {
            generate: stubWithArgs(['LINE_BLAME', 'REPOSITORY_ROOT'], 'BODY')
        };
        const gitAnnotationHtmlBuilder = {
            addCss: sinon.spy(),
            addScript: sinon.spy(),
            addSafeBody: sinon.spy(),
            getHtml: () => 'HTML'
        };
        const commitColorDesignator = {designate: stubWithArgs(['LINE_BLAME'], 'COLOR_MAP')};
        const director = new GitAnnotationHtmlDirector({
            annotationStyleBuilder,
            annotationScriptProvider,
            commitColorDesignator,
            gitAnnotationHtmlBodyGenerator,
            gitAnnotationHtmlBuilder
        });

        strictEqual(director.construct('LINE_BLAME', 'REPOSITORY_ROOT'), 'HTML');
        expect(gitAnnotationHtmlBuilder.addCss).to.have.been.calledWith('CSS');
        expect(gitAnnotationHtmlBuilder.addScript).to.have.been.calledWith('SCRIPT');
        expect(gitAnnotationHtmlBuilder.addSafeBody).to.have.been.calledWith('BODY');
    });
});
