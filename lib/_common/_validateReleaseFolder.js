'use strict';

// Initialize constants
const fs = require('fs');
const config = require('config');

/**
 * @function validateReleaseFolder
 * @description Attempts to validate that the specified release folder exists
 * within the _release directory; if a release folder is specified and could not
 * be verified -- then a hard error will be thrown
 *
 * @param releaseFolder {String} Represents the folder being validated property representing the directory to be validated
 * @return {Boolean} Returns true if a release-folder was specified; returns false if not
 */
function validateReleaseFolder(releaseFolder) {

    // Initialize local variables
    let releaseFolderBasePath,
        releaseFolderPath,
        output;

    // Default the output property
    output = false;

    // First, confirm that the optionsObject exists before validating
    if (typeof releaseFolder !== 'object') {

        // Get the base path for the releaseFolder
        releaseFolderBasePath = config.get('releaseFolderBasePath');

        // Define the releaseFolderPath
        releaseFolderPath = releaseFolderBasePath + releaseFolder;

        // Verify that the release folder exists
        if (fs.existsSync(releaseFolderPath) === false) {

            // Throw a hard error explaining that the specified release-folder could not be verified
            throw new Error(`Error: The release [${releaseFolder}] could not be verified via ${releaseFolderPath}`);

        } else {

            // Yes, a release was specified
            output = true;

        }

    }

    // Return the release findings
    return output;

}

// Export the function
module.exports = validateReleaseFolder;