
'use strict';

const _ = require('lodash');
const Color = require('./color');

class ColorPicker {

    constructor(params) {
        this._startColor = new Color(params.startColor);
        this._endColor = new Color(params.endColor);
        this._calculateScore = params.calculateScore;
    }

    giveColors(list) {
        const scores = list.map(this._calculateScore);
        const uniqScores = _.uniq(scores).sort();
        const colors = this._generateColors(uniqScores.length);
        return scores.map(score => {
            const index = uniqScores.findIndex(aScore => aScore === score);
            return colors[index].hexCode;
        });
    }

    _generateColors(number) {
        if (number === 1) return [this._startColor];

        return _.range(number).map((n, i) => {
            const ratio = i / (number - 1);
            return this._startColor.blend(this._endColor, ratio);
        });
    }
}

module.exports = ColorPicker;
