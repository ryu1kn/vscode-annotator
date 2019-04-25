'use strict';

const AppIntegratorFactory = require('./lib/app-integrator-factory');

exports.activate = context => {
    const appIntegrator = new AppIntegratorFactory(context).create();
    appIntegrator.integrate(context);
};

exports.deactivate = () => {};
