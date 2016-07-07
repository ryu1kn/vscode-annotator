
'use strict';

const vscode = require('vscode');

const AnnotationData = require('./annotation-data');
const AppFactory = require('./app-factory');
const AppIntegrator = require('./app-integrator');
const GitAnnotationContentBuilder = require('./git-annotation-content-builder');
const GitAnnotationContentProvider = require('./git-annotation-content-provider');

class AppIntegratorFactory {

    create() {
        const annotationData = new AnnotationData();
        const app = new AppFactory().create(vscode, console, annotationData);
        const gitAnnotationContentBuilder = new GitAnnotationContentBuilder();
        const gitAnnotationContentProvider = new GitAnnotationContentProvider({
            annotationData, gitAnnotationContentBuilder
        });
        return new AppIntegrator({app, vscode, gitAnnotationContentProvider});
    }
}

module.exports = AppIntegratorFactory;
