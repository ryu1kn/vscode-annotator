
'use strict';

class GitAnnotationHtmlBodyGenerator {

    constructor(params) {
        this._gitAnnotationLineDirectorFactory = params.gitAnnotationLineDirectorFactory;
    }

    generate(lineBlames, repositoryRootPath) {
        const digitsCount = String(lineBlames.length).length;
        return lineBlames.map((lineBlame, index) => {
            const director = this._gitAnnotationLineDirectorFactory.create();
            return director.construct({
                lineBlame,
                lineNumber: index + 1,
                lineNumberWidth: digitsCount,
                repositoryRoot: repositoryRootPath
            });
        }).join('');
    }
}

module.exports = GitAnnotationHtmlBodyGenerator;
