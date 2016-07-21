
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
});
