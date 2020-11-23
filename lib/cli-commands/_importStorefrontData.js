'use strict';

// Initialize any modules
const async = require('async');

// Initialize local functions
const authenticateRequest = require('../ci/_authenticate');
const getArchiveFileName = require('../_common/_getArchiveFileName');
const getEnvironment = require('../_common/_getEnvironment');
const importSiteData = require('../ci/_import');

/**
 * @function importStorefrontData
 * @description This function is used to trigger the import of a storefront site-data archive
 * via the processing of the sfcc-site-archive-export global job.
 *
 * @param [releaseName] {String} Represents the optional name of a release to process
 * @param [processCallback] {Function} Represents the callback function to execute one the zip-archive has been created
 */
function importStorefrontData(releaseName, processCallback) {

    // Initialize local variables
    let environment,
        webDavImportFileName;

    // Retrieve the remote import file-archive path
    webDavImportFileName = getArchiveFileName(releaseName);

    console.log('-----------------------------------');
    console.log(' SFCC-CI | START: npm import');
    console.log('-----------------------------------');

    // Retrieve the environment properties
    environment = getEnvironment();

    // Attempt the file-import
    async.waterfall([

        // Authenticate against the instance
        function authenticate(asyncCallback) {

            // Authenticate the sfcc-ci request
            authenticateRequest(environment, asyncCallback);

        },

        // Process the storefront-data import
        function siteImport(environmentToken, asyncCallback) {

            // Set the instance using the environment information
            importSiteData(environment, webDavImportFileName, environmentToken, function (jobDetails) {

                // Were job-details specified?
                if (jobDetails !== null) {

                    // Debugging: Output that the remote-site import was processed successfully
                    console.log(` ${environment.instanceName}| -- the remote file ${webDavImportFileName} was successfully imported`);

                }

                // Process the callback
                asyncCallback(null);

            });

        }

    ], function(asyncErrorObj) {

        // Was an error defined?  If so, then throw it
        if (asyncErrorObj !== null) { throw asyncErrorObj; }

        console.log('-----------------------------------');
        console.log(' SFCC-CI |  END: npm import');
        console.log('-----------------------------------');

        // Execute the callback -- if it exists
        if (processCallback !== undefined) { processCallback(); }

    });

}

// Export the function
module.exports = importStorefrontData;