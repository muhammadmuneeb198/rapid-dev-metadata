'use strict';

// Initialize constants
const zipFolder = require('zip-folder');

/**
 * @function zipDirectory
 * @description Attempts to zip the contents of a directory -- and produce an archive
 * stored in the targetArchiveFilePath
 *
 * @param basePath (String) Represents the directory being archived / zipped
 * @param targetArchiveFilePath {String} Represents the full-path (including filename) of the archive being written
 * @param [processCallback] {Function} Represents the callback containing the result.
 */
function zipDirectory (basePath, targetArchiveFilePath, processCallback) {

    // If not, then move forward with zipping the codebase
    zipFolder(basePath, targetArchiveFilePath, function (zipErrorObj) {

        // Was an error thrown? If so, then throw it
        if (zipErrorObj !== undefined) { throw zipErrorObj; }

        // Execute the callback -- if it's defined
        if (processCallback !== undefined) { processCallback(); }

    });

}

module.exports = zipDirectory;