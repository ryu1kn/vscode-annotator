
'use strict';

const spawn = require('child_process').spawn;
const path = require('path');
const querystring = require('querystring');

class GitCommand {

    blame(uri) {
        const options = {cwd: path.dirname(uri.path)};
        const commit = querystring.parse(uri.query).commit;
        const args = commit ? ['blame', '--line-porcelain', commit, '--', uri.path] :
                              ['blame', '--line-porcelain', '--', uri.path];
        const blameCommand = spawn('git', args, options);
        return this._getOutput(blameCommand);
    }

    getRepositoryRoot(uri) {
        const options = {cwd: path.dirname(uri.path)};
        const revParseCommand = spawn('git', ['rev-parse', '--show-toplevel'], options);
        return this._getOutput(revParseCommand);
    }

    _getOutput(command) {
        let content = '';
        command.stdout.on('data', data => {
            content += data.toString();
        });
        return new Promise((resolve, reject) => {
            command.stderr.on('data', data => {
                console.error(data.toString());
            });
            command.on('error', err => {
                reject(err);
            });
            command.on('close', _code => {
                resolve(content);
            });
        });
    }
}

module.exports = GitCommand;
