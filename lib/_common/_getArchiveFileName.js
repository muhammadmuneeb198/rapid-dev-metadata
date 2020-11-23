'use strict';

// Initialize constants
const config = require('config');

/**
 * @function getArchiveFileName
 * @description Evaluates the provided releaseName -- and calculates the
 * archive fileName to use; the default is provided, or the release name
 * is used to build the archive fileName
 *
 * @param [releaseName] {String} Represents the name of the release identifier provided by the user
 * @return {String} Returns the archive filename (ex. sfra-data.zip)
 */
function getArchiveFileName(releaseName) {

    // Initialize local variables
    let zipFileName;

    // Was a release specified?
    if (typeof releaseName === 'object') {

        // If not, then use the default zip fileName
        zipFileName = config.get('zipFileName');

    } else {

        // Otherwise, build out the zip fileName
        zipFileName = releaseName + '.zip';

    }

    // Return the calculated fileName
    return zipFileName;

}

// Export the function
module.exports = getArchiveFileName;