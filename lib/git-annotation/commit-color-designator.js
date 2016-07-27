
'use strict';

const _ = require('lodash');
const ColorPicker = require('../color-picker');

class CommitColorDesignator {

    constructor(params) {
        this._startColor = params.startColor;
        this._endColor = params.endColor;
    }

    designate(lineBlames) {
        const picker = new ColorPicker({
            startColor: this._startColor,
            endColor: this._endColor,
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
