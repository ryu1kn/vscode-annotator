import * as sinon from 'sinon';
import {GitAnnotationContentGenerator} from '../../../lib/git-annotation/git-annotation-content-generator';
import {stubWithArgs} from '../../helper/assert';
import {rejects, strictEqual} from 'assert';

suite('GitAnnotationContentGenerator', () => {

    test('it loads git annotation and construct a document', () => {
        const gitService = {
            getBlame: stubWithArgs(['PATH', 'COMMIT_HASH', 'REPOSITORY_ROOT'], Promise.resolve('ANNOTATION_LIST'))
        };
        const gitAnnotationHtmlDirector = {
            construct: stubWithArgs(['ANNOTATION_LIST', 'REPOSITORY_ROOT'], 'ANNOTATION_DOCUMENT')
        };
        const gitAnnotationHtmlDirectorFactory = {create: () => gitAnnotationHtmlDirector};
        const gitAnnotationContentGenerator = new GitAnnotationContentGenerator({
            gitService, gitAnnotationHtmlDirectorFactory
        });

        const params = {
            commitHash: 'COMMIT_HASH',
            path: 'PATH',
            repositoryRoot: 'REPOSITORY_ROOT'
        };
        return gitAnnotationContentGenerator.generate(params).then(document => {
            strictEqual(document, 'ANNOTATION_DOCUMENT');
        });
    });

    test('it finds repository root path if it is not given', () => {
        const gitService = {
            getBlame: stubWithArgs(['PATH', 'COMMIT_HASH', 'REPOSITORY_ROOT'], Promise.resolve('ANNOTATION_LIST')),
            getRepositoryRoot: stubWithArgs(['PATH'], Promise.resolve('REPOSITORY_ROOT'))
        };
        const gitAnnotationHtmlDirector = {
            construct: stubWithArgs(['ANNOTATION_LIST', 'REPOSITORY_ROOT'], 'ANNOTATION_DOCUMENT')
        };
        const gitAnnotationHtmlDirectorFactory = {create: () => gitAnnotationHtmlDirector};
        const gitAnnotationContentGenerator = new GitAnnotationContentGenerator({
            gitService, gitAnnotationHtmlDirectorFactory
        });

        const params = {
            path: 'PATH',
            commitHash: 'COMMIT_HASH'
        };
        return gitAnnotationContentGenerator.generate(params).then(document => {
            strictEqual(document, 'ANNOTATION_DOCUMENT');
        });
    });

    test('it does not try to parse git result if command failed', () => {
        const gitService = {
            getBlame: sinon.stub().returns(Promise.reject(new Error('BLAME_ERROR'))),
            getRepositoryRoot: stubWithArgs(['PATH'], Promise.resolve('REPOSITORY_ROOT\n'))
        };
        const gitBlameOutputParser = {parse: sinon.spy()};
        const gitAnnotationContentGenerator = new GitAnnotationContentGenerator({gitService, gitBlameOutputParser});

        const params = {path: 'PATH'};
        return rejects(gitAnnotationContentGenerator.generate(params), new Error('BLAME_ERROR'));
    });
});
