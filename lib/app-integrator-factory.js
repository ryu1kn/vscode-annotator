
'use strict';

const vscode = require('vscode');

const AnnotationCssBuilder = require('./annotation-css-builder');
const AnnotationData = require('./annotation-data');
const AppFactory = require('./app-factory');
const AppIntegrator = require('./app-integrator');
const ConfigStore = require('./config-store');
const GitAnnotationContentBuilder = require('./git-annotation-content-builder');
const GitAnnotationContentProvider = require('./git-annotation-content-provider');

class AppIntegratorFactory {

    create() {
        const annotationData = new AnnotationData();
        const app = new AppFactory().create(vscode, console, annotationData);
        const configStore = new ConfigStore({workspace: vscode.workspace});
        const annotationCssBuilder = new AnnotationCssBuilder({configStore});
        const gitAnnotationContentBuilder = new GitAnnotationContentBuilder({annotationCssBuilder});
        const gitAnnotationContentProvider = new GitAnnotationContentProvider({
            annotationData, gitAnnotationContentBuilder
        });
        return new AppIntegrator({app, vscode, gitAnnotationContentProvider});
    }
}

module.exports = AppIntegratorFactory;
