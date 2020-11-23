'use strict';

// Initialize any modules
const config = require('config');

// Initialize local functions
const getArchiveFileName = require('../_common/_getArchiveFileName');
const getEnvironment = require('../_common/_getEnvironment');
const validateReleaseFolder = require('../_common/_validateReleaseFolder');
const zipDirectory = require('../_common/_zipDirectory');

/**
 * @function zipStorefrontData
 * @description This function is used to zip the contents of a storefront site or release directory
 *
 * @param [releaseName] {String} Represents the optional name of a release to process
 * @param processCallback {Function} Represents the callback function to execute one the zip-archive has been created
 */
function zipStorefrontData(releaseName, processCallback) {

    // Initialize local variables
    let wasReleaseSpecified,
        environment,
        basePath,
        fileArchivePath,
        zipFileName,
        zipPath;

    // Was the release property included in the CLI command?
    wasReleaseSpecified = validateReleaseFolder(releaseName);

    // Retrieve the details of the configured environment
    environment = getEnvironment();

    // Default the archive path where the .zip will be written
    fileArchivePath = config.get('fileArchivePath');

    // Was a release folder defined?
    if (wasReleaseSpecified === true) {

        // If so, then build out the release-specific path variables
        basePath = config.get('releaseFolderBasePath') + releaseName;

    } else {

        // Default the path variables
        basePath = config.get('basePath');

    }

    // Build out the full path describing where to place the zipFile
    zipFileName = getArchiveFileName(releaseName);
    zipPath = fileArchivePath + zipFileName;

    console.log('-----------------------------------');
    console.log(' SFCC-CI | START: npm zip');
    console.log('-----------------------------------');

    // Debugging: Output the details of the archive process
    console.log(` ${environment.instanceName}| -- archiving ${basePath}`);
    console.log(` ${environment.instanceName}| -- writing .zip-file to ${zipPath}`);

    // Attempt to zip the storefront / release archive
    zipDirectory(basePath, zipPath, function() {

        // Debugging: Audit that the file was written
        console.log(` ${environment.instanceName}| -- .zip-file written to ${zipPath}`);

        console.log('-----------------------------------');
        console.log(' SFCC-CI |   END: npm zip');
        console.log('-----------------------------------');

        // Execute the callback -- if it exists
        if (processCallback !== undefined) { processCallback(); }

    });

}

// Export the function
module.exports = zipStorefrontData;