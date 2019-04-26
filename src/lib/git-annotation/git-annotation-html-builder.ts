
export class GitAnnotationHtmlBuilder {
    private _css: any;
    private _script: any;
    private _safeBodyHtml: any;

    addCss(css) {
        this._css = css;
    }

    addScript(script) {
        this._script = script;
    }

    addSafeBody(safeBodyHtml) {
        this._safeBodyHtml = safeBodyHtml;
    }

    getHtml() {
        return [
            `<style>${this._css}</style>`,
            '<body>',
                this._safeBodyHtml,
                `<script type="text/javascript">${this._script}</script>`,
            '</body>'
        ].join('');
    }

}
