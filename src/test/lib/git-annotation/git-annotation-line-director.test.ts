import * as sinon from 'sinon';
import {GitAnnotationLineDirector} from '../../../lib/git-annotation/git-annotation-line-director';
import {expect} from '../../helper/assert';
import {strictEqual} from 'assert';

suite('GitAnnotationLineDirector', () => {

    test('it composes a line of HTML annotation view', () => {
        const builder = {
            addDetails: sinon.spy(),
            addCaption: sinon.spy(),
            addCommand: sinon.spy(),
            addCommitHash: sinon.spy(),
            addLineContents: sinon.spy(),
            getHtml: () => 'LINE_HTML'
        };
        const director = new GitAnnotationLineDirector({
            builder,
            formatDateTime: date => date.toISOString()
        });
        const params = {
            lineBlame: {
                commitHash: 'COMMIT_HASH',
                authorName: 'AUTHOR_NAME',
                authorTime: 1465725065,
                subject: 'SUBJECT',
                lineContents: 'LINE_CONTENTS'
            },
            lineNumber: 1,
            lineNumberWidth: 3,
            repositoryRoot: 'REPOSITORY_ROOT'
        };
        strictEqual(director.construct(params), 'LINE_HTML');
        expect(builder.addDetails).to.have.been.calledWith('Commit: COMMIT_HASH\nAuthor: AUTHOR_NAME\nDate: 2016-06-12T09:51:05.000Z\n\nSUBJECT');
        expect(builder.addCaption).to.have.been.calledWith('  1  2016-06-12 AUTHOR_NAME');
        expect(builder.addCommitHash).to.have.been.calledWith('COMMIT_HASH');
        expect(builder.addCommand).to.have.been.calledWith({
            name: 'annotator.takeDiff',
            args: [{
                commitHash: 'COMMIT_HASH',
                repositoryRoot: 'REPOSITORY_ROOT'
            }]
        });
        expect(builder.addLineContents).to.have.been.calledWith('LINE_CONTENTS');
    });
});
