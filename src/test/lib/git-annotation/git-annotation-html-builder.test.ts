import {GitAnnotationHtmlBuilder} from '../../../lib/git-annotation/git-annotation-html-builder';
import {expect} from '../../helper/assert';

suite('GitAnnotationHtmlBuilder', () => {

    test('it builds the HTML document of an annotation view', () => {
        const builder = new GitAnnotationHtmlBuilder();
        builder.addCss('CSS');
        builder.addScript('SCRIPT');
        builder.addSafeBody('BODY');
        expect(builder.getHtml()).to.eql('<style>CSS</style><body>BODY<script type="text/javascript">SCRIPT</script></body>');
    });
});
