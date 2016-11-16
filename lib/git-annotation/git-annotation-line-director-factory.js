
const GitAnnotationLineBuilder = require('./git-annotation-line-builder');
const GitAnnotationLineDirector = require('./git-annotation-line-director');

class GitAnnotationLineDirectorFactory {

    create() {
        const builder = new GitAnnotationLineBuilder();
        return new GitAnnotationLineDirector({
            builder,
            formatDateTime: date => date.toLocaleString()
        });
    }

}

module.exports = GitAnnotationLineDirectorFactory;
