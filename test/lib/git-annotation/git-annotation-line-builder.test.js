
const GitAnnotationLineBuilder = require('../../../lib/git-annotation/git-annotation-line-builder');

suite('GitAnnotationLineBuilder', () => {

    test('it composes a line of HTML annotation view', () => {
        const builder = new GitAnnotationLineBuilder();
        builder.addDetails('DETAILS');
        builder.addCommand({name: 'COMMAND_NAME', args: 'COMMAND_ARGS'});
        builder.addCommitHash('COMMIT_HASH');
        builder.addCaption('CAPTION');
        builder.addLineContents('LINE_CONTENTS');
        expect(builder.getHtml()).to.eql([
            /* eslint-disable indent */
            '<div class="line" data-commitHash="COMMIT_HASH" data-details="DETAILS">',
                '<div class="annotation">',
                    '<a href="" data-command="%7B%22name%22:%22COMMAND_NAME%22,%22args%22:%22COMMAND_ARGS%22%7D" class="annotation-inner">',
                        'CAPTION',
                    '</a>',
                '</div>',
                '<div class="commitColor"></div>',
                '<pre><code>LINE_CONTENTS</code></pre>',
            '</div>'
            /* eslint-enable indent */
        ].join(''));
    });

    test('it does not show a link if command is not available', () => {
        const builder = new GitAnnotationLineBuilder();
        builder.addDetails('DETAILS');
        builder.addCaption('CAPTION');
        builder.addCommitHash('COMMIT_HASH');
        builder.addLineContents('LINE_CONTENTS');
        expect(builder.getHtml()).to.eql([
            /* eslint-disable indent */
            '<div class="line" data-commitHash="COMMIT_HASH" data-details="DETAILS">',
                '<div class="annotation">',
                    '<div class="annotation-inner">CAPTION</div>',
                '</div>',
                '<div class="commitColor"></div>',
                '<pre><code>LINE_CONTENTS</code></pre>',
            '</div>'
            /* eslint-enable indent */
        ].join(''));
    });

    test('it escapes characters in the line contents', () => {
        const builder = new GitAnnotationLineBuilder();
        builder.addDetails('DETAILS');
        builder.addCaption('CAPTION');
        builder.addCommitHash('COMMIT_HASH');
        builder.addLineContents('LINE_CONTENTS \\n &#xa; < &lt; > &gt; " \'');
        expect(builder.getHtml()).to.eql([
            /* eslint-disable indent */
            '<div class="line" data-commitHash="COMMIT_HASH" data-details="DETAILS">',
                '<div class="annotation">',
                    '<div class="annotation-inner">CAPTION</div>',
                '</div>',
                '<div class="commitColor"></div>',
                '<pre><code>LINE_CONTENTS \\n &amp;#xa; &lt; &amp;lt; &gt; &amp;gt; &quot; &#39;</code></pre>',
            '</div>'
            /* eslint-enable indent */
        ].join(''));
    });

    test('it escapes characters in the details', () => {
        const builder = new GitAnnotationLineBuilder();
        builder.addDetails('DETAILS <>&"\'\n\\/');
        builder.addCaption('CAPTION');
        builder.addCommitHash('COMMIT_HASH');
        builder.addLineContents('LINE_CONTENTS');
        expect(builder.getHtml()).to.eql([
            /* eslint-disable indent */
            '<div class="line" data-commitHash="COMMIT_HASH" data-details="DETAILS &lt;&gt;&amp;&quot;&#39;&#xa;\\/">',
                '<div class="annotation">',
                    '<div class="annotation-inner">CAPTION</div>',
                '</div>',
                '<div class="commitColor"></div>',
                '<pre><code>LINE_CONTENTS</code></pre>',
            '</div>'
            /* eslint-enable indent */
        ].join(''));
    });

    test('it escapes characters in the caption', () => {
        const builder = new GitAnnotationLineBuilder();
        builder.addDetails('DETAILS');
        builder.addCaption('CAPTION <>&"\'\n\\/');
        builder.addCommitHash('COMMIT_HASH');
        builder.addLineContents('LINE_CONTENTS');
        expect(builder.getHtml()).to.eql([
            /* eslint-disable indent */
            '<div class="line" data-commitHash="COMMIT_HASH" data-details="DETAILS">',
                '<div class="annotation">',
                    '<div class="annotation-inner">CAPTION &lt;&gt;&amp;&quot;&#39;\n\\/</div>',
                '</div>',
                '<div class="commitColor"></div>',
                '<pre><code>LINE_CONTENTS</code></pre>',
            '</div>'
            /* eslint-enable indent */
        ].join(''));
    });
});
