
const CommitColorDesignator = require('../../../lib/git-annotation/commit-color-designator');

suite('CommitColorDesignator', () => {

    test('it assign colours to each commit old one for closer to startColor', () => {
        const configStore = {
            getExtensionConfig: configName => {
                const configs = {
                    annotationCommitColorRange: ['#000000', '#FFFFFF']
                };
                return configs[configName];
            }
        };
        const designator = new CommitColorDesignator({configStore});

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
