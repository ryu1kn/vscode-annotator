
const GitAnnotationContentBuilder = require('../../lib/git-annotation-content-builder');

suite('GitAnnotationContentBuilder', () => {

    test('it composes annotation HTML document from given annotation data', () => {
        const annotationCssBuilder = {build: () => 'CSS'};
        const builder = new GitAnnotationContentBuilder({annotationCssBuilder});
        const lines = [{
            filename: 'FILENAME',
            commitHash: 'COMMIT_HASH',
            authorTime: 1465725065,
            authorName: 'AUTHOR_NAME',
            lineContents: 'LINE_CONTENTS'
        }];

        expect(builder.build(lines, 'REPOSITORY_ROOT')).to.eql([
            /* eslint-disable indent */
            '<style>CSS</style>',
            '<body>',
                '<div class="line">',
                    '<div class="annotation truncate">',
                        '<a href="command:annotation.annotateAt?%5B%22REPOSITORY_ROOT/FILENAME%22,%22COMMIT_HASH%22%5D" class="commit-link">COMMIT</a>',
                        '&nbsp;',
                        '<span>2016-06-12 AUTHOR_NAME</span>',
                    '</div>',
                    '<pre>LINE_CONTENTS</pre>',
                '</div>',
            '</body>'
            /* eslint-enable indent */
        ].join(''));
    });

    test('it does not give a link on a commit hash if the line is not yet committed', () => {
        const annotationCssBuilder = {build: () => 'CSS'};
        const builder = new GitAnnotationContentBuilder({annotationCssBuilder});
        const lines = [{
            filename: 'FILENAME',
            commitHash: '0000000000000000000000000000000000000000',
            authorTime: 1465725065,
            authorName: 'AUTHOR_NAME',
            lineContents: 'LINE_CONTENTS'
        }];

        expect(builder.build(lines, 'REPOSITORY_ROOT')).to.eql([
            /* eslint-disable indent */
            '<style>CSS</style>',
            '<body>',
                '<div class="line">',
                    '<div class="annotation truncate">',
                        '------',
                        '&nbsp;',
                        '<span>2016-06-12 AUTHOR_NAME</span>',
                    '</div>',
                    '<pre>LINE_CONTENTS</pre>',
                '</div>',
            '</body>'
            /* eslint-enable indent */
        ].join(''));
    });
});
