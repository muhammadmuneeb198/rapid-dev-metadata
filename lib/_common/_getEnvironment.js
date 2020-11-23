'use strict';

// Initialize the .env confirmation
require('dotenv').config();

/**
 * @function getEnvironment
 * @description Builds out a convenience object describing the environment to which
 * the archived site-data (.zip file) will be uploaded
 *
 * @return {Object} Represents the object containing the environment object data.
 */
function getEnvironment() {

    // Initialize the output property
    let output;

    // Build out the environment object
    output = {
        instanceUrl: process.env.INSTANCEURL,
        instanceName: process.env.INSTANCENAME,
        clientId: process.env.CLIENTID,
        clientSecret: process.env.CLIENTSECRET
    };

    // Return the environment properties
    return output;

}

module.exports = getEnvironment;