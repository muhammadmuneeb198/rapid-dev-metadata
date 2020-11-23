'use strict';

// Initialize any required modules
const ccci = require('sfcc-ci');

/**
 * @function uploadSiteData
 * @description Attempts to upload the defined site archive
 *
 * @param {Object} environment Represents the environment to be interacted with
 * @param {String} siteArchive Represents the path of the storefront-data archive to upload
 * @param {String} token Represents the authentication token to use to verify the environment
 * @param {Function} processCallback Represents the callback function to execute once processing has completed
 */
function uploadSiteData(environment, siteArchive, token, processCallback) {

    // Debugging: Output the directory to which the storefront data is being uploaded
    console.log(` ${environment.instanceName}| -- uploading ${siteArchive} to the B2C Commerce instance`);

    // Attempt to upload the site-import file specified
    ccci.instance.upload(environment.instanceUrl, siteArchive, token, null, function(errorObj) {

        // Was an error response found? If so, then throw it
        if (errorObj !== undefined ) { throw errorObj; }

        // If a process-callback was defined, then execute it
        if (processCallback !== undefined) { processCallback(); }

    });

}

module.exports = uploadSiteData;
