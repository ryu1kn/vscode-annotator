
const GitService = require('../../lib/git-service');

suite('GitService', () => {

    suite('#gitBlame', () => {

        test('it executes git blame with a file path and commit hash', () => {
            const shellCommandRunner = {run: sinon.stub().returns(Promise.resolve('BLAME'))};
            const gitBlameOutputParser = {parse: stubWithArgs(['BLAME'], 'PARSED_BLAME')};
            const gitService = new GitService({gitBlameOutputParser, shellCommandRunner});

            return gitService.getBlame('/PATH/TO/FILE', 'COMMIT_HASH', 'ROOT_PATH').then(result => {
                expect(result).to.eql('PARSED_BLAME');
                expect(shellCommandRunner.run).to.have.been.calledWith(
                    'git', ['blame', '--line-porcelain', 'COMMIT_HASH', '--', '/PATH/TO/FILE'], {cwd: 'ROOT_PATH'}
                );
            });
        });

        test('it invokes git blame without commitHash if it is not given', () => {
            const shellCommandRunner = {run: sinon.stub().returns(Promise.resolve('BLAME'))};
            const gitBlameOutputParser = {parse: stubWithArgs(['BLAME'], 'PARSED_BLAME')};
            const gitService = new GitService({gitBlameOutputParser, shellCommandRunner});

            const commitHash = undefined;
            return gitService.getBlame('/PATH/TO/FILE', commitHash, 'ROOT_PATH').then(result => {
                expect(result).to.eql('PARSED_BLAME');
                expect(shellCommandRunner.run).to.have.been.calledWith(
                    'git', ['blame', '--line-porcelain', '--', '/PATH/TO/FILE'], {cwd: 'ROOT_PATH'}
                );
            });
        });
    });

    suite('#getChangedFilesInCommit', () => {

        test('it lists all the changed files in a commit with their change type (e.g. M/A/D/...)', () => {
            const changedFileListParser = {parse: sinon.spy()};
            const shellCommandRunner = {run: sinon.stub().returns(Promise.resolve('GIT_OUTPUT'))};
            const gitService = new GitService({changedFileListParser, shellCommandRunner});
            return gitService.getChangedFilesInCommit('COMMIT_HASH', 'REPOSITORY_ROOT').then(() => {
                expect(shellCommandRunner.run).to.have.been.calledWith(
                    'git', ['diff-tree', 'COMMIT_HASH', '--name-status', '--no-commit-id', '-M', '-r'], {cwd: 'REPOSITORY_ROOT'}
                );
                expect(changedFileListParser.parse).to.have.been.calledWith('GIT_OUTPUT');
            });
        });
    });

    suite('#getRepositoryRoot', () => {

        test('it executes git rev-parse to get the absolute path of git repository', () => {
            const shellCommandRunner = {run: sinon.spy()};
            const gitService = new GitService({shellCommandRunner});
            gitService.getRepositoryRoot('/PATH/TO/FILE');
            expect(shellCommandRunner.run).to.have.been.calledWith(
                'git', ['rev-parse', '--show-toplevel'], {cwd: '/PATH/TO'}
            );
        });
    });

    suite('#show', () => {

        test('it shows the contents of a specified file of a specified commit', () => {
            const shellCommandRunner = {run: sinon.spy()};
            const gitService = new GitService({shellCommandRunner});
            gitService.getFileContents('COMMIT', '/PATH/TO/FILE', 'ROOT_PATH');
            expect(shellCommandRunner.run).to.have.been.calledWith(
                'git', ['show', 'COMMIT:/PATH/TO/FILE'], {cwd: 'ROOT_PATH'}
            );
        });
    });
});
