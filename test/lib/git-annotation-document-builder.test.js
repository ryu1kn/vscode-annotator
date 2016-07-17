
const GitAnnotationDocumentBuilder = require('../../lib/git-annotation-document-builder');

suite('GitAnnotationDocumentBuilder', () => {

    test('it composes annotation HTML document from given annotation data', () => {
        const annotationStyleBuilder = {build: () => 'CSS'};
        const builder = new GitAnnotationDocumentBuilder({annotationStyleBuilder});
        const lines = [{
            filename: 'FILENAME',
            commitHash: 'COMMIT_HASH',
            authorTime: 1465725065,
            authorName: 'AUTHOR_NAME',
            lineContents: 'LINE_CONTENTS',
            subject: 'SUBJECT'
        }];

        expect(builder.build(lines, 'REPOSITORY_ROOT')).to.eql([
            /* eslint-disable indent */
            '<style>CSS</style>',
            '<body>',
                '<div class="line">',
                    '<div class="annotation" data-details="Commit: COMMIT_HASH&#xa;Author: AUTHOR_NAME&#xa;Date: 2016-06-12 19:51:05&#xa;&#xa;SUBJECT">',
                        '<a href="command:annotator.takeDiff?%5B%7B%22repositoryRoot%22:%22REPOSITORY_ROOT%22,%22path%22:%22FILENAME%22,%22commitHash%22:%22COMMIT_HASH%22%7D%5D" class="annotation-inner">',
                            '1  COMMIT_ 2016-06-12 AUTHOR_NAME',
                        '</a>',
                    '</div>',
                    '<pre><code>LINE_CONTENTS</code></pre>',
                '</div>',
            '</body>'
            /* eslint-enable indent */
        ].join(''));
    });

    test('it does not give a link on a commit hash if the line is not yet committed', () => {
        const annotationStyleBuilder = {build: () => 'CSS'};
        const builder = new GitAnnotationDocumentBuilder({annotationStyleBuilder});
        const lines = [{
            filename: 'FILENAME',
            commitHash: '0000000000000000000000000000000000000000',
            authorTime: 1465725065,
            authorName: 'AUTHOR_NAME',
            lineContents: 'LINE_CONTENTS',
            subject: 'SUBJECT'
        }];

        expect(builder.build(lines, 'REPOSITORY_ROOT')).to.eql([
            /* eslint-disable indent */
            '<style>CSS</style>',
            '<body>',
                '<div class="line">',
                    '<div class="annotation" data-details="Commit: 0000000000000000000000000000000000000000&#xa;Author: AUTHOR_NAME&#xa;Date: 2016-06-12 19:51:05&#xa;&#xa;SUBJECT">',
                        '<div class="annotation-inner">1</div>',
                    '</div>',
                    '<pre><code>LINE_CONTENTS</code></pre>',
                '</div>',
            '</body>'
            /* eslint-enable indent */
        ].join(''));
    });

    test('it escapes "<" character in the line contents', () => {
        const annotationStyleBuilder = {build: () => 'CSS'};
        const builder = new GitAnnotationDocumentBuilder({annotationStyleBuilder});
        const lines = [{
            filename: 'FILENAME',
            commitHash: 'COMMIT_HASH',
            authorTime: 1465725065,
            authorName: 'AUTHOR_NAME',
            lineContents: 'LINE_CONTENTS \\n &#xa; < &lt; > &gt; " \'',
            subject: 'SUBJECT'
        }];

        expect(builder.build(lines, 'REPOSITORY_ROOT')).to.eql([
            /* eslint-disable indent */
            '<style>CSS</style>',
            '<body>',
                '<div class="line">',
                    '<div class="annotation" data-details="Commit: COMMIT_HASH&#xa;Author: AUTHOR_NAME&#xa;Date: 2016-06-12 19:51:05&#xa;&#xa;SUBJECT">',
                        '<a href="command:annotator.takeDiff?%5B%7B%22repositoryRoot%22:%22REPOSITORY_ROOT%22,%22path%22:%22FILENAME%22,%22commitHash%22:%22COMMIT_HASH%22%7D%5D" class="annotation-inner">',
                            '1  COMMIT_ 2016-06-12 AUTHOR_NAME',
                        '</a>',
                    '</div>',
                    '<pre><code>LINE_CONTENTS \\n &amp;#xa; &lt; &amp;lt; &gt; &amp;gt; &quot; &#39;</code></pre>',
                '</div>',
            '</body>'
            /* eslint-enable indent */
        ].join(''));
    });

    test('it escapes characters in the author name', () => {
        const annotationStyleBuilder = {build: () => 'CSS'};
        const builder = new GitAnnotationDocumentBuilder({annotationStyleBuilder});
        const lines = [{
            filename: 'FILENAME',
            commitHash: 'COMMIT_HASH',
            authorTime: 1465725065,
            authorName: 'DODGY_AUTHOR_NAME <"\'`>',
            lineContents: 'LINE_CONTENTS',
            subject: 'SUBJECT'
        }];

        expect(builder.build(lines, 'REPOSITORY_ROOT')).to.eql([
            /* eslint-disable indent */
            '<style>CSS</style>',
            '<body>',
                '<div class="line">',
                    '<div class="annotation" data-details="Commit: COMMIT_HASH&#xa;Author: DODGY_AUTHOR_NAME &lt;&quot;&#39;&#96;&gt;&#xa;Date: 2016-06-12 19:51:05&#xa;&#xa;SUBJECT">',
                        '<a href="command:annotator.takeDiff?%5B%7B%22repositoryRoot%22:%22REPOSITORY_ROOT%22,%22path%22:%22FILENAME%22,%22commitHash%22:%22COMMIT_HASH%22%7D%5D" class="annotation-inner">',
                            '1  COMMIT_ 2016-06-12 DODGY_AUTHOR_NAME &lt;&quot;&#39;&#96;&gt;',
                        '</a>',
                    '</div>',
                    '<pre><code>LINE_CONTENTS</code></pre>',
                '</div>',
            '</body>'
            /* eslint-enable indent */
        ].join(''));
    });

    test('it escapes characters in the details', () => {
        const annotationStyleBuilder = {build: () => 'CSS'};
        const builder = new GitAnnotationDocumentBuilder({annotationStyleBuilder});
        const lines = [{
            filename: 'FILENAME',
            commitHash: 'COMMIT_HASH',
            authorTime: 1465725065,
            authorName: 'AUTHOR_NAME',
            lineContents: 'LINE_CONTENTS',
            subject: 'SUBJECT <>&"\'\n\\/'
        }];

        expect(builder.build(lines, 'REPOSITORY_ROOT')).to.eql([
            /* eslint-disable indent */
            '<style>CSS</style>',
            '<body>',
                '<div class="line">',
                    '<div class="annotation" data-details="Commit: COMMIT_HASH&#xa;Author: AUTHOR_NAME&#xa;Date: 2016-06-12 19:51:05&#xa;&#xa;SUBJECT &lt;&gt;&amp;&quot;&#39;&#xa;\\/">',
                        '<a href="command:annotator.takeDiff?%5B%7B%22repositoryRoot%22:%22REPOSITORY_ROOT%22,%22path%22:%22FILENAME%22,%22commitHash%22:%22COMMIT_HASH%22%7D%5D" class="annotation-inner">',
                            '1  COMMIT_ 2016-06-12 AUTHOR_NAME',
                        '</a>',
                    '</div>',
                    '<pre><code>LINE_CONTENTS</code></pre>',
                '</div>',
            '</body>'
            /* eslint-enable indent */
        ].join(''));
    });

    test('it gives padding for the line number', () => {
        'use strict';

        const annotationStyleBuilder = {build: () => 'CSS'};
        const builder = new GitAnnotationDocumentBuilder({annotationStyleBuilder});
        const line = {
            filename: 'FILENAME',
            commitHash: 'COMMIT_HASH',
            authorTime: 1465725065,
            authorName: 'AUTHOR_NAME',
            lineContents: 'LINE_CONTENTS',
            subject: 'SUBJECT'
        };
        const lines = [];
        for (let i = 0; i < 101; i++) lines.push(line);

        expect(builder.build(lines, 'REPOSITORY_ROOT')).to.have.string([
            /* eslint-disable indent */
            '<style>CSS</style>',
            '<body>',
                '<div class="line">',
                    '<div class="annotation" data-details="Commit: COMMIT_HASH&#xa;Author: AUTHOR_NAME&#xa;Date: 2016-06-12 19:51:05&#xa;&#xa;SUBJECT">',
                        '<a href="command:annotator.takeDiff?%5B%7B%22repositoryRoot%22:%22REPOSITORY_ROOT%22,%22path%22:%22FILENAME%22,%22commitHash%22:%22COMMIT_HASH%22%7D%5D" class="annotation-inner">',
                            '  1  COMMIT_ 2016-06-12 AUTHOR_NAME',
                        '</a>',
                    '</div>',
                    '<pre><code>LINE_CONTENTS</code></pre>',
                '</div>'
            /* eslint-enable indent */
        ].join(''));
    });
});
