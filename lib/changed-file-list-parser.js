
class ChangedFileListParser {

    parse(gitOutput) {
        const lines = gitOutput.trim().split('\n');
        const commits = lines[0].split(' ');
        return {
            commitHash: commits[0],
            previousCommitHash: commits[1],
            changedFiles: lines.slice(1).map(entry => this._parseChangeEntry(entry))
        };
    }

    _parseChangeEntry(entry) {
        const columns = entry.split('\t');
        const changeType = columns[0].charAt(0);
        switch (changeType) {
        case 'A':
            return {
                changeType,
                path: columns[1],
                previousPath: null
            };
        case 'D':
            return {
                changeType,
                path: null,
                previousPath: columns[1]
            };
        case 'R':
            return {
                changeType,
                path: columns[2],
                previousPath: columns[1]
            };
        case 'M':
        case 'T':
        case 'U':
        case 'X':
            return {
                changeType,
                path: columns[1],
                previousPath: columns[1]
            };
        default:
            throw new Error('There should have been a change type');
        }
    }

}

module.exports = ChangedFileListParser;
