import {Color} from '../../lib/color';
import {expect} from '../helper/assert';

suite('Color', () => {

    test('it accepts 6 hex digits color code', () => {
        const color = new Color('#808080');
        expect(color.hexCode).to.eql('#808080');
    });

    test('it accepts RGB value array', () => {
        const color = new Color([128, 128, 128]);
        expect(color.hexCode).to.eql('#808080');
    });

    test('it blends with other color with given ratio', () => {
        const color1 = new Color('#000000');
        const color2 = new Color('#FFFFFF');
        expect(color1.blend(color2, 0.5).hexCode).to.eql('#808080');
    });

    test('it blends with other color with given ratio', () => {
        const color1 = new Color('#FFFFFF');
        const color2 = new Color('#FFFFFF');
        expect(color1.blend(color2, 0.3).hexCode).to.eql('#FFFFFF');
    });
});
