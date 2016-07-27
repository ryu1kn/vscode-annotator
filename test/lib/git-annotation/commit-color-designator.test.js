
const CommitColorDesignator = require('../../../lib/git-annotation/commit-color-designator');

suite('CommitColorDesignator', () => {

    test('it assign colours to each commit old one for closer to startColor', () => {
        const designator = new CommitColorDesignator({
            startColor: '#000000',
            endColor: '#FFFFFF'
        });

        const lineBlames = [
            {commitHash: 'COMMIT_1', authorTime: 200},
            {commitHash: 'COMMIT_2', authorTime: 100},
            {commitHash: 'COMMIT_3', authorTime: 110}
        ];
        expect(designator.designate(lineBlames)).to.eql({
            COMMIT_1: '#FFFFFF',
            COMMIT_2: '#000000',
            COMMIT_3: '#808080'
        });
    });
});
