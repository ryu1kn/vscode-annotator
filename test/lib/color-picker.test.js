
const ColorPicker = require('../../lib/color-picker');

suite('ColorPicker', () => {

    test('it picks colours for each element in a given array', () => {
        const colorPicker = new ColorPicker({
            startColor: '#000000',
            endColor: '#FFFFFF',
            calculateScore: value => value
        });
        const colors = colorPicker.giveColors([1, 2, 3]);
        expect(colors).to.eql(['#000000', '#808080', '#FFFFFF']);
    });

    test('it uses startColor if only one value given', () => {
        const colorPicker = new ColorPicker({
            startColor: '#000000',
            endColor: '#FFFFFF',
            calculateScore: value => value
        });
        const colors = colorPicker.giveColors([10]);
        expect(colors).to.eql(['#000000']);
    });

    test('it returns an empty array if no values given', () => {
        const colorPicker = new ColorPicker({
            startColor: '#000000',
            endColor: '#FFFFFF',
            calculateScore: value => value
        });
        const colors = colorPicker.giveColors([]);
        expect(colors).to.eql([]);
    });

    test('it gives the same colour for the same value', () => {
        const colorPicker = new ColorPicker({
            startColor: '#000000',
            endColor: '#FFFFFF',
            calculateScore: value => value
        });
        const colors = colorPicker.giveColors([1, 2, 2]);
        expect(colors).to.eql(['#000000', '#FFFFFF', '#FFFFFF']);
    });

    test('it uses colors closer to startColor for smaller scores', () => {
        const colorPicker = new ColorPicker({
            startColor: '#000000',
            endColor: '#FFFFFF',
            calculateScore: value => value
        });
        const colors = colorPicker.giveColors([2, 1]);
        expect(colors).to.eql(['#FFFFFF', '#000000']);
    });
});
