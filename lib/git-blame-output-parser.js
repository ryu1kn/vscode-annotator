
// Porcelain format, see https://git-scm.com/docs/git-blame

const ATTRIBUTE_NAME_MAP = {
    author: 'authorName',
    'author-mail': 'authorMail',
    'author-time': 'authorTime',
    'author-tz': 'authorTz',
    committer: 'committerName',
    'committer-mail': 'committerMail',
    'committer-time': 'committerTime',
    'committer-tz': 'committerTz',
    summary: 'subject',
    filename: 'filename'
};

class GitBlameOutputParser {

    parse(gitOutput) {
        return this._getLineInfoList(gitOutput).map(this._parseLineInfo.bind(this));
    }

    _getLineInfoList(gitOutput) {
        const regexForOneLineInfo = /\n\t[^\n]*\n/g;
        const lineInfoList = [];
        for (let startIndex = 0; regexForOneLineInfo.exec(gitOutput) !== null; startIndex = regexForOneLineInfo.lastIndex) {    // eslint-disable-line max-len
            lineInfoList.push(gitOutput.substring(startIndex, regexForOneLineInfo.lastIndex));
        }
        return lineInfoList;
    }

    _parseLineInfo(lineInfo) {
        const lines = lineInfo.split('\n').slice(0, -1);
        const header = this._parseHeader(lines[0]);
        const attributes = lines.slice(1, -1).reduce((memo, line) => {
            return Object.assign({}, memo, this._parseAttribute(line));
        }, {});
        const lineContents = lines.slice(-1)[0].replace('\t', '');
        return Object.assign({}, header, attributes, {lineContents});
    }

    _parseHeader(commitLine) {
        const hashAndLineNumber = commitLine.split(' ');
        return {
            commitHash: hashAndLineNumber[0],
            lineNoInOriginalFile: Number(hashAndLineNumber[1]),
            lineNoInFinalFile: Number(hashAndLineNumber[2])
        };
    }

    _parseAttribute(attributeLine) {
        const delimiterIndex = attributeLine.indexOf(' ');
        return this._convertAttributeToMap(
            attributeLine.slice(0, delimiterIndex),
            attributeLine.slice(delimiterIndex + 1)
        );
    }

    _convertAttributeToMap(attributeName, attributeValue) {
        switch (attributeName) {
        case 'author-time':
        case 'committer-time':
            return {[ATTRIBUTE_NAME_MAP[attributeName]]: Number(attributeValue)};
        case 'previous': {
            const previousData = attributeValue.split(' ');
            return {
                previousCommitHash: previousData[0],
                previousFilename: previousData[1]
            };
        }
        default:
            return {[ATTRIBUTE_NAME_MAP[attributeName]]: attributeValue};
        }
    }

}

module.exports = GitBlameOutputParser;
