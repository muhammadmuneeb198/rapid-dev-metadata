'use strict';

// Initialize any required modules
const ccci = require('sfcc-ci');

/**
 * @function authenticate
 * @description Attempts to authenticate the SFCC-CI client to work against a given environment
 *
 * @param environment {Object} Represents the environment to be authenticated against
 * @param processCallback {Function} Represents the callback function to execute once processing has completed
 */
function authenticate(environment, processCallback) {

    // Attempt to authenticate via the clientId / clientSecret specified
    ccci.auth.auth(environment.clientId, environment.clientSecret, function (token, errorObj) {

        // Was an error caught?
        if (errorObj !== undefined) {

            // Throw the error
            throw errorObj;

        // Otherwise, was a valid token defined?
        } else {

            // Execute the callback and pass-in the token
            processCallback(null, token);

        }

    });

}

module.exports = authenticate;
