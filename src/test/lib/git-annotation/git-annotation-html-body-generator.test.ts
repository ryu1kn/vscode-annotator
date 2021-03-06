import * as sinon from 'sinon';
import {GitAnnotationHtmlBodyGenerator} from '../../../lib/git-annotation/git-annotation-html-body-generator';
import {expect} from '../../helper/assert';
import {strictEqual} from 'assert';

suite('GitAnnotationHtmlBodyGenerator', () => {

    test('it composes annotation HTML body from given annotation data', () => {
        const gitAnnotationLineDirector = {construct: sinon.stub().returns('LINE_HTML')};
        const gitAnnotationLineDirectorFactory = {create: sinon.stub().returns(gitAnnotationLineDirector)};
        const generator = new GitAnnotationHtmlBodyGenerator({gitAnnotationLineDirectorFactory});
        const lines = [{
            filename: 'FILENAME',
            commitHash: 'COMMIT_HASH',
            authorTime: 1465725065,
            authorName: 'AUTHOR_NAME',
            lineContents: 'LINE_CONTENTS',
            subject: 'SUBJECT'
        }];

        strictEqual(generator.generate(lines, 'REPOSITORY_ROOT'), 'LINE_HTML');
        expect(gitAnnotationLineDirector.construct).to.have.been.calledWith({
            lineBlame: {
                authorName: 'AUTHOR_NAME',
                authorTime: 1465725065,
                commitHash: 'COMMIT_HASH',
                filename: 'FILENAME',
                lineContents: 'LINE_CONTENTS',
                subject: 'SUBJECT'
            },
            lineNumber: 1,
            lineNumberWidth: 1,
            repositoryRoot: 'REPOSITORY_ROOT'
        });
    });
});
