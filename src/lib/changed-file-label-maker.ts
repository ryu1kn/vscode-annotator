
export class ChangedFileLabelMaker {

    make(item) {
        switch (item.changeType) {
        case 'D':
            return `[ D ] ${item.previousPath}`;
        case 'R':
            return `[ R ] ${item.previousPath} \u2192 ${item.path}`;
        default:
            return `[ ${item.changeType} ] ${item.path}`;
        }
    }

}
