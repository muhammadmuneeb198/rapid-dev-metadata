'use strict';

// Initialize any modules
const fs = require('fs');
const async = require('async');
const config = require('config');

// Initialize local functions
const authenticateRequest = require('../ci/_authenticate');
const getArchiveFileName = require('../_common/_getArchiveFileName');
const getEnvironment = require('../_common/_getEnvironment');
const uploadSiteData = require('../ci/_upload');

/**
 * @function uploadStorefrontData
 * @description This function is used to upload the an archived site-data or release to the configured
 * Salesforce B2C Commerce environment for import processing.
 *
 * @param [releaseName] {String} Represents the optional name of a release to process
 * @param [processCallback] {Function} Represents the callback function to execute one the zip-archive has been created
 */
function uploadStorefrontData(releaseName, processCallback) {

    // Initialize local variables
    let environment,
        fileArchivePath,
        zipFileName,
        archiveFilePath;

    // Retrieve the environment properties
    environment = getEnvironment();

    // Default the path variables
    fileArchivePath = config.get('fileArchivePath');

    // Calculate the archive file-name
    zipFileName = getArchiveFileName(releaseName);

    // Build out the full path describing where to place the zipFile
    archiveFilePath = fileArchivePath + zipFileName;

    console.log('-----------------------------------');
    console.log(' SFCC-CI | START: npm upload');
    console.log('-----------------------------------');

    // Before we begin, let's verify the archive path exists
    if (!fs.existsSync(archiveFilePath)) {

        // If it doesn't, let's create a new error calling out the issue (the archive wasn't found)
        throw new Error(`  ${environment.instanceName}| -- .zip storefront-data archive not found; execute the [npm run zip] command`);

    } else {

        // Debugging: Output that the file-upload was completed successfully
        console.log(` ${environment.instanceName}| -- the archive ${archiveFilePath} was successfully verified`);

    }

    // Attempt the file-import
    async.waterfall([

        // Authenticate against the instance
        function authenticate(asyncCallback) {

            // Authenticate the sfcc-ci request
            authenticateRequest(environment, asyncCallback);

        },

        // Process the import upload
        function upload(environmentToken, asyncCallback) {

            // Set the instance using the environment information
            uploadSiteData(environment, archiveFilePath, environmentToken, function () {

                // Debugging: Output that the file-upload was completed successfully
                console.log(` ${environment.instanceName}| -- the archive ${archiveFilePath} was successfully uploaded`);

                // Process the callback
                asyncCallback(null);

            });

        }

    ], function(asyncErrorObj) {

        // Was an error defined?  If so, then throw it
        if (asyncErrorObj !== null) { throw asyncErrorObj; }

        // Debugging: Output that the file-upload was completed successfully
        console.log(` ${environment.instanceName}| -- storefront site-import upload successfully`);

        console.log('-----------------------------------');
        console.log(' SFCC-CI |  END: npm upload');
        console.log('-----------------------------------');

        // Execute the callback -- if it exists
        if (processCallback !== undefined) { processCallback(); }

    });

}

// Export the function
module.exports = uploadStorefrontData;