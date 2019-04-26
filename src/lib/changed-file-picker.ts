import {ChangedFileLabelMaker} from './changed-file-label-maker';

const _size = obj => obj ? Object.keys(obj).length : 0;

export class ChangedFilePicker {
    private _window: any;
    private _changedFileLabelMaker: ChangedFileLabelMaker;

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
