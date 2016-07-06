
'use strict';

// Porcelain format, see https://git-scm.com/docs/git-blame

class GitBlameOutputParser {

    parse(gitOutput) {
        return this._getLineInfoList(gitOutput).map(this._parseLineInfo.bind(this));
    }

    _getLineInfoList(gitOutput) {
        const regexForOneLineInfo = /\n\t[^\n]*\n/g;
        const lineInfoList = [];
        for (let startIndex = 0; regexForOneLineInfo.exec(gitOutput) !== null; startIndex = regexForOneLineInfo.lastIndex) {
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
            commit: hashAndLineNumber[0],
            'line-no-in-original-file': Number(hashAndLineNumber[1]),
            'line-no-in-final-file': Number(hashAndLineNumber[2])
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
            return {[attributeName]: Number(attributeValue)};
        case 'previous': {
            const previousData = attributeValue.split(' ');
            return {
                'previous-commit': previousData[0],
                'previous-filename': previousData[1]
            };
        }
        default:
            return {[attributeName]: attributeValue};
        }
    }
}

module.exports = GitBlameOutputParser;
