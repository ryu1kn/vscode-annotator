
'use strict';

const _ = require('lodash');
const Const = require('./const');
const querystring = require('querystring');

class UriService {

    constructor(params) {
        this._Uri = params.Uri;
        this._getCurrentDate = params.getCurrentDateFn;
    }

    encodeAnnotateFileAction(params) {
        const givenParams = _.pick(params, ['path', 'repositoryRoot']);
        const queryParams = Object.assign({}, givenParams, {_ts: this._getCurrentDate()});
        return this._Uri.parse(`${Const.EXTENSION_NAME}:annotate-file?${querystring.stringify(queryParams)}`);
    }

    encodeShowFileAction(params) {
        const queryParams = _.pick(params, ['path', 'commitHash', 'repositoryRoot']);
        return this._Uri.parse(`${Const.EXTENSION_NAME}:show-file?${querystring.stringify(queryParams)}`);
    }

    encodeShowEmptyFileAction() {
        return this._Uri.parse(`${Const.EXTENSION_NAME}:show-emptyfile`);
    }
}

module.exports = UriService;
