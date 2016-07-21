
'use strict';

const GitAnnotationLineBuilder = require('./git-annotation-line-builder');
const GitAnnotationLineDirector = require('./git-annotation-line-director');

class GitAnnotationDocumentBuilderFactory {

    create() {
        const builder = new GitAnnotationLineBuilder();
        return new GitAnnotationLineDirector(builder);
    }

}

module.exports = GitAnnotationDocumentBuilderFactory;
