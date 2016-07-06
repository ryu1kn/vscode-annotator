
'use strict';

const vscode = require('vscode');

const GitAnnotationContentProvider = require('./git-annotation-content-provider');
const AppIntegrator = require('./app-integrator');
const AppFactory = require('./app-factory');

class AppIntegratorFactory {
    create() {
        const app = new AppFactory().create(vscode, console);
        const gitAnnotationContentProvider = new GitAnnotationContentProvider();
        return new AppIntegrator({app, vscode, gitAnnotationContentProvider});
    }
}

module.exports = AppIntegratorFactory;
