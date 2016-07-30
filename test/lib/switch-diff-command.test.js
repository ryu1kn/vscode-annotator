
const _ = require('lodash');
const SwitchDiffCommand = require('../../lib/switch-diff-command');
const querystring = require('querystring');

suite('SwitchDiffCommand', () => {

    test('it takes diff of another file in the same commit', () => {
        const uriService = {getAction: () => 'ACTION'};
        const commands = {executeCommand: sinon.spy()};
        const gitCommand = {diffTree: sinon.stub().returns(Promise.resolve('GIT_OUTPUT'))};
        const changedFileListParser = {parse: sinon.stub().returns('PARSED_GIT_OUTPUT')};
        const changedFilePicker = {pick: sinon.stub().returns({
            path: 'PATH',
            previousPath: 'PREVIOUS_PATH'
        })};
        const switchDiffCommand = new SwitchDiffCommand({
            uriService,
            changedFilePicker,
            changedFileListParser,
            gitCommand,
            commands
        });

        const uriQuery = {
            commitHash: 'COMMIT_HASH',
            previousCommitHash: 'PREVIOUS_COMMIT_HASH',
            repositoryRoot: 'REPOSITORY_ROOT'
        };
        const editor = _.set({}, 'document.uri.query', querystring.stringify(uriQuery));
        return switchDiffCommand.execute(editor).then(() => {
            expect(commands.executeCommand).to.have.been.calledWith('annotator.takeDiff', {
                commitHash: 'COMMIT_HASH',
                path: 'PATH',
                previousCommitHash: 'PREVIOUS_COMMIT_HASH',
                previousPath: 'PREVIOUS_PATH',
                repositoryRoot: 'REPOSITORY_ROOT'
            });
            expect(gitCommand.diffTree).to.have.been.calledWith('COMMIT_HASH', 'REPOSITORY_ROOT');
            expect(changedFileListParser.parse).to.have.been.calledWith('GIT_OUTPUT');
            expect(changedFilePicker.pick).to.have.been.calledWith('PARSED_GIT_OUTPUT');
        });
    });

    test('it does nothing if action is not available in the uri', () => {
        const uriService = {getAction: () => null};
        const gitCommand = {diffTree: sinon.spy()};
        const switchDiffCommand = new SwitchDiffCommand({uriService, gitCommand});

        const editor = _.set({}, 'document.uri', 'URI');
        return switchDiffCommand.execute(editor).then(result => {
            expect(result).to.be.undefined;
            expect(gitCommand.diffTree).to.have.been.not.called;
        });
    });

    test('it prints stack trace if error occurred', () => {
        const uriService = {getAction: sinon.stub().throws(new Error('URI_SERVICE_ERROR'))};
        const logger = {error: sinon.spy()};
        const switchDiffCommand = new SwitchDiffCommand({uriService, logger});

        const editor = _.set({}, 'document.uri', 'URI');
        return switchDiffCommand.execute(editor).then(() => {
            expect(logger.error.args[0][0]).to.have.string('Error: URI_SERVICE_ERROR');
        });
    });
});
