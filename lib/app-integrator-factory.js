
'use strict';

const vscode = require('vscode');

const GitAnnotationContentProvider = require('./git-annotation-content-provider');
const AnnotationData = require('./annotation-data');
const AppIntegrator = require('./app-integrator');
const AppFactory = require('./app-factory');

class AppIntegratorFactory {
    create() {
        const annotationData = new AnnotationData();
        const app = new AppFactory().create(vscode, console, annotationData);
        const gitAnnotationContentProvider = new GitAnnotationContentProvider({annotationData});
        return new AppIntegrator({app, vscode, gitAnnotationContentProvider});
    }
}

module.exports = AppIntegratorFactory;
