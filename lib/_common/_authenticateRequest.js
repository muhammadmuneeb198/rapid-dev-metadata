'use strict';

// Initialize the CI library
const ci = require('../ci');

/**
 * @function authenticateRequest
 * @description This function is used to remotely authenticate the sfcc-ci request using
 * the credentials provided via the .env configuration file; it writes a valid token token
 * to the global environmentToken variable - which is referenced downstream
 *
 * @param environment {Object} Represents the .env configuration
 * @param asyncCallback {Function} Represents the asyncCallback function invoked upon completion
 */
function authenticateRequest(environment, asyncCallback) {

    // Debugging: Audit the sfcc-ci operation
    console.log(` ${environment.instanceName}| -- authenticating; retrieving the authToken`);

    // Set the instance using the environment information
    ci.authenticate(environment, function (token) {

        // Debugging: Audit the auth-token that was retrieved
        console.log(` ${environment.instanceName}| -- authToken is [${token}]`);

        // Process the callback
        asyncCallback(null, token);

    });

}

// Export the function so that it's available
module.exports = authenticateRequest;