'use strict';

// Initialize any modules
const async = require('async');

// Initialize local functions
const authenticateRequest = require('../ci/_authenticate');
const getEnvironment = require('../_common/_getEnvironment');
const reIndexSiteData = require('../ci/_reIndex');

/**
 * @function reIndexStorefront
 * @description This function is used to trigger the re-indexing of a storefront.  This
 * includes product and catalog indexes.
 *
 * @param [processCallback] {Function} Represents the callback function to execute one the reIndex has completed
 */
function reIndexStorefront(processCallback) {

    // Initialize local variables
    let environment;

    console.log('-----------------------------------');
    console.log(' SFCC-CI | START: npm re-index');
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

        // Reindex the storefront product and content indexes
        function reIndex(environmentToken, asyncCallback) {

            // Set the instance using the environment information
            reIndexSiteData(environment, environmentToken, function (jobDetails) {

                // Were job-details specified?
                if (jobDetails !== null) {

                    // Debugging: Output that the remote-index rebuild was processed successfully
                    console.log(` ${environment.instanceName}| -- the site product and catalog indexes were successfully rebuilt`);

                }

                // Process the callback
                asyncCallback(null);

            });

        }

    ], function(asyncErrorObj) {

        // Was an error defined?  If so, then throw it
        if (asyncErrorObj !== null) { throw asyncErrorObj; }

        console.log('-----------------------------------');
        console.log(' SFCC-CI |  END: npm re-index');
        console.log('-----------------------------------');

        // Execute the callback -- if it exists
        if (processCallback !== undefined) { processCallback(); }

    });

}

// Export the function
module.exports = reIndexStorefront;