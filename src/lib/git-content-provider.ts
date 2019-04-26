import {GitService} from './git-service';
import {GitAnnotationContentGenerator} from './git-annotation/git-annotation-content-generator';
import {UriService} from './uri-service';

const querystring = require('querystring');

export class GitContentProvider {
    private _gitService: GitService;
    private _gitAnnotationContentGenerator: GitAnnotationContentGenerator;
    private _uriService: UriService;

    constructor(params) {
        this._gitService = params.gitService;
        this._gitAnnotationContentGenerator = params.gitAnnotationContentGenerator;
        this._uriService = params.uriService;
    }

    provideTextDocumentContent(uri) {
        const action = this._uriService.getAction(uri);
        switch (action) {
        case 'annotate-file':
            return this._getAnnotationContents(uri);
        case 'show-file':
            return this._getFileContents(uri);
        default:
            return Promise.reject(new Error('Unknown action'));
        }
    }

    _getAnnotationContents(uri) {
        const params = querystring.parse(uri.query);
        return this._gitAnnotationContentGenerator.generate(params);
    }

    _getFileContents(uri) {
        const params = querystring.parse(uri.query);
        if (!params.path) return Promise.resolve('');
        return this._gitService.getFileContents(params.commitHash, params.path, params.repositoryRoot);
    }

}
