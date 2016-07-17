
const GitCommand = require('../../lib/git-command');

suite('GitCommand', () => {

    suite('#blame', () => {

        test('it executes git blame with a file path and commit hash', () => {
            const shellCommandRunner = {run: sinon.stub().returns(Promise.resolve('BLAME'))};
            const gitCommand = new GitCommand({shellCommandRunner});

            return gitCommand.blame('/PATH/TO/FILE', 'COMMIT_HASH', 'ROOT_PATH').then(result => {
                expect(result).to.eql('BLAME');
                expect(shellCommandRunner.run).to.have.been.calledWith(
                    'git', ['blame', '--line-porcelain', 'COMMIT_HASH', '--', '/PATH/TO/FILE'], {cwd: 'ROOT_PATH'}
                );
            });
        });

        test('it invokes git blame without commitHash if it is not given', () => {
            const shellCommandRunner = {run: sinon.stub().returns(Promise.resolve('BLAME'))};
            const gitCommand = new GitCommand({shellCommandRunner});

            const commitHash = undefined;
            return gitCommand.blame('/PATH/TO/FILE', commitHash, 'ROOT_PATH').then(result => {
                expect(result).to.eql('BLAME');
                expect(shellCommandRunner.run).to.have.been.calledWith(
                    'git', ['blame', '--line-porcelain', '--', '/PATH/TO/FILE'], {cwd: 'ROOT_PATH'}
                );
            });
        });
    });

    suite('#getRepositoryRoot', () => {

        test('it executes git rev-parse to get the absolute path of git repository', () => {
            const shellCommandRunner = {run: sinon.spy()};
            const gitCommand = new GitCommand({shellCommandRunner});
            gitCommand.getRepositoryRoot('/PATH/TO/FILE');
            expect(shellCommandRunner.run).to.have.been.calledWith(
                'git', ['rev-parse', '--show-toplevel'], {cwd: '/PATH/TO'}
            );
        });
    });

    suite('#show', () => {

        test('it shows the contents of a specified file of a specified commit', () => {
            const shellCommandRunner = {run: sinon.spy()};
            const gitCommand = new GitCommand({shellCommandRunner});
            gitCommand.show('COMMIT', '/PATH/TO/FILE', 'ROOT_PATH');
            expect(shellCommandRunner.run).to.have.been.calledWith(
                'git', ['show', 'COMMIT:/PATH/TO/FILE'], {cwd: 'ROOT_PATH'}
            );
        });
    });
});
