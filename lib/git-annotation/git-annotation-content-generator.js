
class GitAnnotationContentGenerator {

    constructor(params) {
        this._gitService = params.gitService;
        this._gitAnnotationHtmlDirectorFactory = params.gitAnnotationHtmlDirectorFactory;
    }

    generate(params) {
        return this._getRepositoryRoot(params).then(repositoryRoot => {
            return this._gitService.getBlame(params.path, params.commitHash, repositoryRoot)
                .then(blameLines => {
                    const gitAnnotationHtmlDirector = this._gitAnnotationHtmlDirectorFactory.create();
                    return gitAnnotationHtmlDirector.construct(blameLines, repositoryRoot);
                });
        });
    }

    _getRepositoryRoot(params) {
        return Promise.resolve(
            params.repositoryRoot || this._gitService.getRepositoryRoot(params.path)
        );
    }

}

module.exports = GitAnnotationContentGenerator;
