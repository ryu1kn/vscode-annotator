
'use strict';

const Const = require('./const');
const querystring = require('querystring');

class UriService {

    constructor(params) {
        this._Uri = params.Uri;
        this._getCurrentDate = params.getCurrentDateFn;
    }

    convertToAnnotateFileAction(uri) {
        const queryParams = this._getQueryParams(uri);
        return this._Uri.parse(`${Const.EXTENSION_NAME}:annotate-file?${querystring.stringify(queryParams)}`);
    }

    _getQueryParams(uri) {
        if (uri.scheme === 'file') {
            return {
                path: uri.fsPath,
                _ts: this._getCurrentDate()
            };
        } else if (uri.scheme === Const.EXTENSION_NAME && uri.path === 'show-file') {
            const queryObject = querystring.parse(uri.query);
            if (!queryObject.previousCommitHash) throw new Error('No previous commit available');
            return {
                path: queryObject.previousPath,
                commitHash: queryObject.previousCommitHash,
                repositoryRoot: queryObject.repositoryRoot
            };
        }
        throw new Error('Annotation cannot be given for this editor contents');
    }

    encodeShowFileAction(params) {
        return this._Uri.parse(`${Const.EXTENSION_NAME}:show-file?${querystring.stringify(params)}`);
    }

    encodeShowEmptyFileAction() {
        return this._Uri.parse(`${Const.EXTENSION_NAME}:show-emptyfile`);
    }
}

module.exports = UriService;
