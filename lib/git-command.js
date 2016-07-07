
'use strict';

const path = require('path');

class GitCommand {

    constructor(params) {
        this._childProcess = params.childProcess;
    }

    blame(filePath, commit) {
        const options = {cwd: path.dirname(filePath)};
        const args = commit ? ['blame', '--line-porcelain', commit, '--', filePath] :
                              ['blame', '--line-porcelain', '--', filePath];
        const blameCommand = this._childProcess.spawn('git', args, options);
        return this._executeCommand(blameCommand);
    }

    getRepositoryRoot(filePath) {
        const options = {cwd: path.dirname(filePath)};
        const revParseCommand = this._childProcess.spawn('git', ['rev-parse', '--show-toplevel'], options);
        return this._executeCommand(revParseCommand);
    }

    _executeCommand(command) {
        let stdoutString = '';
        let stderrString = '';

        command.stdout.on('data', data => {
            stdoutString += data.toString();
        });
        command.stderr.on('data', data => {
            stderrString += data.toString();
        });

        return new Promise((resolve, reject) => {
            command.on('error', err => {
                reject(err);
            });
            command.on('close', code => {
                if (code !== 0) {
                    const err = new Error('git command finished with non-zero');
                    reject(Object.assign(err, {code, stderrString}));
                } else {
                    resolve(stdoutString);
                }
            });
        });
    }
}

module.exports = GitCommand;
