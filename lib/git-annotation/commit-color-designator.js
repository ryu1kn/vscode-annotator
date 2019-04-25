
const _uniqWith = require('lodash.uniqwith');
const ColorPicker = require('../color-picker');

class CommitColorDesignator {

    constructor(params) {
        this._configStore = params.configStore;
    }

    designate(lineBlames) {
        const commitColorRange = this._configStore.getExtensionConfig('annotationCommitColorRange');
        const picker = new ColorPicker({
            colors: commitColorRange,
            calculateScore: commit => commit.authorTime
        });
        const uniqCommits = _uniqWith(lineBlames, (a, b) => a.commitHash === b.commitHash);
        const colors = picker.giveColors(uniqCommits);
        return uniqCommits.reduce((memo, commit, i) => {
            memo[commit.commitHash] = colors[i];
            return memo;
        }, {});
    }

}

module.exports = CommitColorDesignator;
