
const _size = obj => obj ? Object.keys(obj).length : 0;

class ChangedFilePicker {

    constructor(params) {
        this._window = params.window;
        this._changedFileLabelMaker = params.changedFileLabelMaker;
    }

    async pick(items) {
        const itemsWithLabel = items.map(
            item => Object.assign({}, item, {label: this._changedFileLabelMaker.make(item)})
        );
        const item = await this._window.showQuickPick(itemsWithLabel);
        if (_size(item) === 0) return null;
        const {path, previousPath} = item;
        return {path, previousPath};
    }

}

module.exports = ChangedFilePicker;
