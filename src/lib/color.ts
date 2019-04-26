
const _parseInt = require('lodash.parseint');

const HEX_DIGITS = '0123456789ABCDEF'.split('');

export class Color {
    private readonly _color: any;

    constructor(colorCode) {
        this._color = this._normalise(colorCode);
    }

    blend(otherColor, ratio) {
        return new Color([
            this._blendScale(this._color.r, otherColor._color.r, ratio),
            this._blendScale(this._color.g, otherColor._color.g, ratio),
            this._blendScale(this._color.b, otherColor._color.b, ratio)
        ]);
    }

    get hexCode() {
        const rgb = [this._color.r, this._color.g, this._color.b];
        return '#' + rgb.map(this._getHexScale).join('');
    }

    _blendScale(aScale, bScale, ratio) {
        return Math.round((aScale * (1 - ratio)) + (bScale * ratio));
    }

    _normalise(colorCode) {
        if (Array.isArray(colorCode)) {
            return {
                r: colorCode[0],
                g: colorCode[1],
                b: colorCode[2]
            };
        }
        return {
            r: _parseInt(colorCode.substring(1, 3), 16),
            g: _parseInt(colorCode.substring(3, 5), 16),
            b: _parseInt(colorCode.substring(5, 7), 16)
        };
    }

    _getHexScale(scale) {
        return HEX_DIGITS[Math.floor(scale / 16)] + HEX_DIGITS[scale % 16];
    }

}
