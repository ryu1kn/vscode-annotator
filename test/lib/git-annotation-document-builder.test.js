
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
            lineContents: 'LINE_CONTENTS'
        }];

        expect(builder.build(lines, 'REPOSITORY_ROOT')).to.eql([
            /* eslint-disable indent */
            '<style>CSS</style>',
            '<body>',
                '<div class="line">',
                    '<div class="annotation truncate">',
                        '<a href="command:annotation.takeDiff?%5B%7B%22commitHash%22:%22COMMIT_HASH%22,%22filename%22:%22FILENAME%22%7D,%22REPOSITORY_ROOT%22%5D" class="commit-link">COMMIT</a>',
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
        const annotationStyleBuilder = {build: () => 'CSS'};
        const builder = new GitAnnotationDocumentBuilder({annotationStyleBuilder});
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

    test('it escapes "<" character in the line contents', () => {
        const annotationStyleBuilder = {build: () => 'CSS'};
        const builder = new GitAnnotationDocumentBuilder({annotationStyleBuilder});
        const lines = [{
            filename: 'FILENAME',
            commitHash: 'COMMIT_HASH',
            authorTime: 1465725065,
            authorName: 'AUTHOR_NAME',
            lineContents: 'TEXT < > < TEXT'
        }];

        expect(builder.build(lines, 'REPOSITORY_ROOT')).to.eql([
            /* eslint-disable indent */
            '<style>CSS</style>',
            '<body>',
                '<div class="line">',
                    '<div class="annotation truncate">',
                        '<a href="command:annotation.takeDiff?%5B%7B%22commitHash%22:%22COMMIT_HASH%22,%22filename%22:%22FILENAME%22%7D,%22REPOSITORY_ROOT%22%5D" class="commit-link">COMMIT</a>',
                        '&nbsp;',
                        '<span>2016-06-12 AUTHOR_NAME</span>',
                    '</div>',
                    '<pre>TEXT &lt; > &lt; TEXT</pre>',
                '</div>',
            '</body>'
            /* eslint-enable indent */
        ].join(''));
    });
});
