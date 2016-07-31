
'use strict';

const _ = require('lodash');

class ChangedFilePicker {

    constructor(params) {
        this._window = params.window;
        this._changedFileLabelMaker = params.changedFileLabelMaker;
    }

    pick(items) {
        const itemsWithLabel = items.map(item =>
            Object.assign({}, item, {label: this._changedFileLabelMaker.make(item)})
        );
        return this._window.showQuickPick(itemsWithLabel).then(item =>
            _.size(item) !== 0 ? _.pick(item, ['path', 'previousPath']) : null
        );
    }

}

module.exports = ChangedFilePicker;
