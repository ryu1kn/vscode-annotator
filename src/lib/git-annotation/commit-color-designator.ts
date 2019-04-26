import {ConfigStore} from '../config-store';
import {ColorPicker} from '../color-picker';

const _uniqWith = require('lodash.uniqwith');

export class CommitColorDesignator {
    private readonly _configStore: ConfigStore;

    constructor(params) {
        this._configStore = params.configStore;
    }

    designate(lineBlames) {
        const commitColorRange = this._configStore.getExtensionConfig('annotationCommitColorRange');
        const picker = new ColorPicker({
            colors: commitColorRange,
            calculateScore: commit => commit.authorTime
        });
        const uniqCommits = _uniqWith(lineBlames, (a, b) => a.commitHash === b.commitHash);
        const colors = picker.giveColors(uniqCommits);
        return uniqCommits.reduce((memo, commit, i) => {
            memo[commit.commitHash] = colors[i];
            return memo;
        }, {});
    }

}
