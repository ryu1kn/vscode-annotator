import {SwitchDiffCommand} from '../../../lib/command/switch-diff';
import * as sinon from 'sinon';
import {expect} from '../../helper/assert';

const _set = require('lodash.set');
const querystring = require('querystring');

suite('SwitchDiffCommand', () => {

    test('it takes diff of another file in the same commit', () => {
        const uriService = {getAction: () => 'ACTION'};
        const commands = {executeCommand: sinon.spy()};
        const gitService = {getChangedFilesInCommit: sinon.stub().returns(Promise.resolve({
            previousCommitHash: 'PREVIOUS_COMMIT_HASH',
            changedFiles: 'FILES'
        }))};
        const changedFilePicker = {pick: sinon.stub().returns(Promise.resolve({
            path: 'PATH',
            previousPath: 'PREVIOUS_PATH'
        }))};
        const switchDiffCommand = new SwitchDiffCommand({
            uriService,
            changedFilePicker,
            gitService,
            commands
        });

        const uriQuery = {
            commitHash: 'COMMIT_HASH',
            repositoryRoot: 'REPOSITORY_ROOT'
        };
        const editor = _set({}, 'document.uri.query', querystring.stringify(uriQuery));
        return switchDiffCommand.execute(editor).then(() => {
            expect(commands.executeCommand).to.have.been.calledWith('annotator.takeDiff', {
                commitHash: 'COMMIT_HASH',
                path: 'PATH',
                previousCommitHash: 'PREVIOUS_COMMIT_HASH',
                previousPath: 'PREVIOUS_PATH',
                repositoryRoot: 'REPOSITORY_ROOT'
            });
            expect(gitService.getChangedFilesInCommit).to.have.been.calledWith('COMMIT_HASH', 'REPOSITORY_ROOT');
            expect(changedFilePicker.pick).to.have.been.calledWith('FILES');
        });
    });

    test('it does nothing if no file is selected', () => {
        const uriService = {getAction: () => 'ACTION'};
        const commands = {executeCommand: sinon.spy()};
        const gitService = {getChangedFilesInCommit: sinon.stub().returns(Promise.resolve('FILES'))};
        const changedFilePicker = {pick: sinon.stub().returns(Promise.resolve(null))};
        const switchDiffCommand = new SwitchDiffCommand({
            uriService,
            changedFilePicker,
            gitService,
            commands
        });

        const uriQuery = {
            commitHash: 'COMMIT_HASH',
            repositoryRoot: 'REPOSITORY_ROOT'
        };
        const editor = _set({}, 'document.uri.query', querystring.stringify(uriQuery));
        return switchDiffCommand.execute(editor).then(() => {
            expect(commands.executeCommand).to.have.been.not.called;
        });
    });

    test('it does nothing if action is not available in the uri', () => {
        const uriService = {getAction: () => null};
        const gitService = {getChangedFilesInCommit: sinon.spy()};
        const switchDiffCommand = new SwitchDiffCommand({uriService, gitService});

        const editor = _set({}, 'document.uri', 'URI');
        return switchDiffCommand.execute(editor).then(result => {
            expect(result).to.be.undefined;
            expect(gitService.getChangedFilesInCommit).to.have.been.not.called;
        });
    });

    test('it prints stack trace if error occurred', () => {
        const uriService = {getAction: sinon.stub().throws(new Error('URI_SERVICE_ERROR'))};
        const logger = {error: sinon.spy()};
        const switchDiffCommand = new SwitchDiffCommand({uriService, logger});

        const editor = _set({}, 'document.uri', 'URI');
        return switchDiffCommand.execute(editor).then(() => {
            expect(logger.error.args[0][0]).to.have.string('Error: URI_SERVICE_ERROR');
        });
    });
});
