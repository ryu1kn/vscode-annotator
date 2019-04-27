import * as sinon from 'sinon';
import {GitService} from '../../lib/git-service';
import {expect, stubWithArgs} from '../helper/assert';
import {deepStrictEqual, strictEqual} from 'assert';

suite('GitService', () => {

    suite('#gitBlame', () => {

        test('it executes git blame with a file path and commit hash', () => {
            const {gitService, shellCommandRunner} = createGitService();

            return gitService.getBlame('/PATH/TO/FILE', 'COMMIT_HASH', 'ROOT_PATH').then(result => {
                strictEqual(result, 'PARSED_BLAME');
                expect(shellCommandRunner.run).to.have.been.calledWith(
                    '/PATH/TO/GIT',
                    ['blame', '--line-porcelain', 'COMMIT_HASH', '--', '/PATH/TO/FILE'],
                    {cwd: 'ROOT_PATH'}
                );
            });
        });

        test('it invokes git blame without commitHash if it is not given', () => {
            const {gitService, shellCommandRunner} = createGitService();

            const commitHash = undefined;
            return gitService.getBlame('/PATH/TO/FILE', commitHash, 'ROOT_PATH').then(result => {
                strictEqual(result, 'PARSED_BLAME');
                expect(shellCommandRunner.run).to.have.been.calledWith(
                    '/PATH/TO/GIT', ['blame', '--line-porcelain', '--', '/PATH/TO/FILE'], {cwd: 'ROOT_PATH'}
                );
            });
        });

        test('it pass `-w` option to blame command if ignoring whitespace is required', () => {
            const {gitService, shellCommandRunner} = createGitService({ignoreWhitespace: true});

            return gitService.getBlame('/PATH/TO/FILE', 'COMMIT_HASH', 'ROOT_PATH').then(() => {
                deepStrictEqual(shellCommandRunner.run.args[0][1], [
                    'blame', '-w', '--line-porcelain', 'COMMIT_HASH', '--', '/PATH/TO/FILE'
                ]);
            });
        });

        function createGitService({ignoreWhitespace} = {ignoreWhitespace: false}) {
            const config = {'git.ignoreWhitespaceOnBlame': ignoreWhitespace};
            const configStore = {
                getGitConfig: () => '/PATH/TO/GIT',
                getExtensionConfig: configName => config[configName]
            };
            const shellCommandRunner = {run: sinon.stub().returns(Promise.resolve('BLAME'))};
            const gitBlameOutputParser = {parse: stubWithArgs(['BLAME'], 'PARSED_BLAME')};
            const gitService = new GitService({configStore, gitBlameOutputParser, shellCommandRunner});
            return {gitService, shellCommandRunner};
        }
    });

    suite('#_git', () => {

        test('it holds the git path specified in the settings', () => {
            const configStore = {getGitConfig: stubWithArgs(['path'], '/PATH/TO/GIT')};
            const gitService = new GitService({configStore});
            strictEqual(gitService._gitPath, '/PATH/TO/GIT');
        });

        test('it returns "git" if the git path is not specified in the settings', () => {
            const configStore = {getGitConfig: () => null};
            const gitService = new GitService({configStore});
            strictEqual(gitService._gitPath, 'git');
        });
    });

    suite('#getChangedFilesInCommit', () => {

        test('it lists all the changed files in a commit with their change type (e.g. M/A/D/...)', () => {
            const configStore = {getGitConfig: () => '/PATH/TO/GIT'};
            const changedFileListParser = {parse: sinon.spy()};
            const shellCommandRunner = {run: sinon.stub().returns(Promise.resolve('GIT_OUTPUT'))};
            const gitService = new GitService({configStore, changedFileListParser, shellCommandRunner});
            return gitService.getChangedFilesInCommit('COMMIT_HASH', 'REPOSITORY_ROOT').then(() => {
                expect(shellCommandRunner.run).to.have.been.calledWith(
                    '/PATH/TO/GIT',
                    ['diff-tree', 'COMMIT_HASH', '--name-status', '--parents', '--root', '-M', '-r'],
                    {cwd: 'REPOSITORY_ROOT'}
                );
                expect(changedFileListParser.parse).to.have.been.calledWith('GIT_OUTPUT');
            });
        });
    });

    suite('#getRepositoryRoot', () => {

        test('it executes git rev-parse to get the absolute path of git repository', () => {
            const configStore = {getGitConfig: () => '/PATH/TO/GIT'};
            const shellCommandRunner = {run: sinon.stub().returns(Promise.resolve('PATH\n'))};
            const gitService = new GitService({configStore, shellCommandRunner});
            return gitService.getRepositoryRoot('/PATH/TO/FILE').then(path => {
                strictEqual(path, 'PATH');
                expect(shellCommandRunner.run).to.have.been.calledWith(
                    '/PATH/TO/GIT', ['rev-parse', '--show-toplevel'], {cwd: '/PATH/TO'}
                );
            });
        });
    });

    suite('#getFileContents', () => {

        test('it shows the contents of a specified file of a specified commit', () => {
            const configStore = {getGitConfig: () => '/PATH/TO/GIT'};
            const shellCommandRunner = {run: sinon.spy()};
            const gitService = new GitService({configStore, shellCommandRunner});
            gitService.getFileContents('COMMIT', '/PATH/TO/FILE', 'ROOT_PATH');
            expect(shellCommandRunner.run).to.have.been.calledWith(
                '/PATH/TO/GIT', ['show', 'COMMIT:/PATH/TO/FILE'], {cwd: 'ROOT_PATH'}
            );
        });
    });
});
