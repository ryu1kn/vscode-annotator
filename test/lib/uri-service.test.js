
const UriService = require('../../lib/uri-service');

suite('UriService', () => {

    suite('#encodeAnnotateFileAction', () => {

        test('it encodes annotate-file action', () => {
            const Uri = {parse: sinon.stub().returns('URI')};
            const getCurrentDateFn = () => 'DATE';
            const uriService = new UriService({Uri, getCurrentDateFn});

            const params = {
                path: 'PATH',
                repositoryRoot: 'REPOSITORY_ROOT'
            };
            expect(uriService.encodeAnnotateFileAction(params)).to.eql('URI');
            expect(Uri.parse).to.have.been.calledWith(
                'annotator:annotate-file?path=PATH&repositoryRoot=REPOSITORY_ROOT&_ts=DATE'
            );
        });
    });

    suite('#encodeShowFileAction', () => {

        test('it encodes show-file action', () => {
            const Uri = {parse: sinon.stub().returns('URI')};
            const uriService = new UriService({Uri});

            const params = {
                path: 'PATH',
                repositoryRoot: 'REPOSITORY_ROOT',
                commitHash: 'COMMIT_HASH'
            };
            expect(uriService.encodeShowFileAction(params)).to.eql('URI');
            expect(Uri.parse).to.have.been.calledWith(
                'annotator:show-file?path=PATH&commitHash=COMMIT_HASH&repositoryRoot=REPOSITORY_ROOT'
            );
        });
    });

    suite('#encodeShowEmptyFileAction', () => {

        test('it encodes show-emptyfile action', () => {
            const Uri = {parse: sinon.stub().returns('URI')};
            const uriService = new UriService({Uri});

            expect(uriService.encodeShowEmptyFileAction()).to.eql('URI');
            expect(Uri.parse).to.have.been.calledWith('annotator:show-emptyfile');
        });
    });
});
