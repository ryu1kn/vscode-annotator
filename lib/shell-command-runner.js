
'use strict';

class ShellCommandRunner {

    constructor(params) {
        this._childProcess = params.childProcess;
    }

    run(commandName, commandArgs, options) {
        const command = this._childProcess.spawn(commandName, commandArgs, options);
        return this._collectResult(command);
    }

    _collectResult(command) {
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
                    const message = stderrString.trim() ||
                            `git command finished with exit code ${code}`;
                    reject(new Error(message));
                } else {
                    resolve(stdoutString);
                }
            });
        });
    }
}

module.exports = ShellCommandRunner;
