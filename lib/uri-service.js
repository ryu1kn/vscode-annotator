
'use strict';

const Const = require('./const');
const path = require('path');
const querystring = require('querystring');

class UriService {

    constructor(params) {
        this._Uri = params.Uri;
        this._getCurrentDate = params.getCurrentDateFn;
    }

    convertToAnnotateFileAction(uri) {
        const queryParams = this._getQueryParams(uri);
        return queryParams ?
            this._Uri.parse(`${Const.EXTENSION_NAME}:annotate-file?${querystring.stringify(queryParams)}`) :
            null;
    }

    _getQueryParams(uri) {
        if (uri.scheme === 'file') {
            return {
                path: uri.fsPath,
                _ts: this._getCurrentDate()
            };
        } else if (uri.scheme === Const.EXTENSION_NAME && this.getAction(uri) === 'show-file') {
            const queryObject = querystring.parse(uri.query);
            if (!queryObject.previousCommitHash) return null;
            return {
                path: queryObject.previousPath,
                commitHash: queryObject.previousCommitHash,
                repositoryRoot: queryObject.repositoryRoot
            };
        }
        throw new Error('Annotation cannot be given for this editor contents');
    }

    getAction(uri) {
        return uri.scheme === Const.EXTENSION_NAME ? uri.path.split('/')[0] : null;
    }

    encodeShowFileAction(params) {
        const encodedParams = querystring.stringify(params);

        // Need filename in the path so that editor can understand filetype
        const uriPath = 'show-file' + (params.path ? `/${path.basename(params.path)}` : '');
        return this._Uri.parse(`${Const.EXTENSION_NAME}:${uriPath}?${encodedParams}`);
    }
}

module.exports = UriService;
