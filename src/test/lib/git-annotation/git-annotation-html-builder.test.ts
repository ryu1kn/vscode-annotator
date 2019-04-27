import {GitAnnotationHtmlBuilder} from '../../../lib/git-annotation/git-annotation-html-builder';
import {strictEqual} from 'assert';

suite('GitAnnotationHtmlBuilder', () => {

    test('it builds the HTML document of an annotation view', () => {
        const builder = new GitAnnotationHtmlBuilder();
        builder.addCss('CSS');
        builder.addScript('SCRIPT');
        builder.addSafeBody('BODY');
        strictEqual(builder.getHtml(), '<style>CSS</style><body>BODY<script type="text/javascript">SCRIPT</script></body>');
    });
});
