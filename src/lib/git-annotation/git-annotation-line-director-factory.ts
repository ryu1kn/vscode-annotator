
import {GitAnnotationLineBuilder} from './git-annotation-line-builder';
import {GitAnnotationLineDirector} from './git-annotation-line-director';

export class GitAnnotationLineDirectorFactory {

    create() {
        const builder = new GitAnnotationLineBuilder();
        return new GitAnnotationLineDirector({
            builder,
            formatDateTime: date => date.toLocaleString()
        });
    }

}
