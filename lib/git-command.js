
'use strict';

const spawn = require('child_process').spawn;
const path = require('path');

class GitCommand {

    blame(filePath, commit) {
        const options = {cwd: path.dirname(filePath)};
        const args = commit ? ['blame', '--line-porcelain', commit, '--', filePath] :
                              ['blame', '--line-porcelain', '--', filePath];
        const blameCommand = spawn('git', args, options);
        return this._getOutput(blameCommand);
    }

    getRepositoryRoot(filePath) {
        const options = {cwd: path.dirname(filePath)};
        const revParseCommand = spawn('git', ['rev-parse', '--show-toplevel'], options);
        return this._getOutput(revParseCommand);
    }

    _getOutput(command) {
        let output = '';
        let errorOutput = '';

        command.stdout.on('data', data => {
            output += data.toString();
        });
        command.stderr.on('data', data => {
            errorOutput += data.toString();
        });

        return new Promise((resolve, reject) => {
            command.on('error', err => {
                reject(err);
            });
            command.on('close', code => {
                if (code !== 0) {
                    const err = new Error('git command finished with non-zero');
                    reject(Object.assign(err, {code, errorOutput}));
                } else {
                    resolve(output);
                }
            });
        });
    }
}

module.exports = GitCommand;
