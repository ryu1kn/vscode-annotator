
'use strict';

const _ = require('lodash');
const ColorPicker = require('../color-picker');

class CommitColorDesignator {

    constructor(params) {
        this._configStore = params.configStore;
    }

    designate(lineBlames) {
        const commitColorRange = this._configStore.getExtensionConfig('annotationCommitColorRange');
        const picker = new ColorPicker({
            startColor: commitColorRange[0],
            endColor: commitColorRange[1],
            calculateScore: commit => commit.authorTime
        });
        const uniqCommits = _.uniqWith(lineBlames, (a, b) => a.commitHash === b.commitHash);
        const colors = picker.giveColors(uniqCommits);
        return uniqCommits.reduce((memo, commit, i) => {
            memo[commit.commitHash] = colors[i];
            return memo;
        }, {});
    }
}

module.exports = CommitColorDesignator;
