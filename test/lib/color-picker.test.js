
const ColorPicker = require('../../lib/color-picker');

suite('ColorPicker', () => {

    test('it picks colours for each element in a given array', () => {
        const colorPicker = new ColorPicker({
            colors: ['#000000', '#FFFFFF'],
            calculateScore: value => value
        });
        const colors = colorPicker.giveColors([1, 2, 3]);
        expect(colors).to.eql(['#000000', '#808080', '#FFFFFF']);
    });

    test('it uses the first colour if only one value given', () => {
        const colorPicker = new ColorPicker({
            colors: ['#000000', '#FFFFFF'],
            calculateScore: value => value
        });
        const colors = colorPicker.giveColors([10]);
        expect(colors).to.eql(['#000000']);
    });

    test('it returns an empty array if no values given', () => {
        const colorPicker = new ColorPicker({
            colors: ['#000000', '#FFFFFF'],
            calculateScore: value => value
        });
        const colors = colorPicker.giveColors([]);
        expect(colors).to.eql([]);
    });

    test('it gives the same colour for the same value', () => {
        const colorPicker = new ColorPicker({
            colors: ['#000000', '#FFFFFF'],
            calculateScore: value => value
        });
        const colors = colorPicker.giveColors([1, 2, 2]);
        expect(colors).to.eql(['#000000', '#FFFFFF', '#FFFFFF']);
    });

    test('it uses colours closer to the first colour for smaller scores', () => {
        const colorPicker = new ColorPicker({
            colors: ['#000000', '#FFFFFF'],
            calculateScore: value => value
        });
        const colors = colorPicker.giveColors([2, 1]);
        expect(colors).to.eql(['#FFFFFF', '#000000']);
    });

    test('it allows you to specify multiple intermediate colours', () => {
        const colorPicker = new ColorPicker({
            colors: ['#000000', '#003300', '#330033'],
            calculateScore: value => value
        });
        const colors = colorPicker.giveColors([1, 2, 3, 4]);
        expect(colors).to.eql(['#000000', '#002200', '#112211', '#330033']);
    });
});
