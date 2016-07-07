
'use strict';

class AnnotationData {

    set(annotation) {
        this._data = annotation;
    }

    get() {
        return this._data;
    }
}

module.exports = AnnotationData;
