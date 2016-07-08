
const AnnotationData = require('../../lib/annotation-data');

suite('AnnotationData', () => {

    test('it stores given data', () => {
        const annotationData = new AnnotationData();
        annotationData.set('ANNOTATION');
        expect(annotationData.get()).to.eql('ANNOTATION');
    });
});
