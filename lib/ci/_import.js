'use strict';

// Initialize any required modules
const ccci = require('sfcc-ci');

// Initialize any local function libraries
const getJobStatus = require('./_getJobStatus');

/**
 * @function importSiteData
 * @description Attempts to upload the defined site archive
 *
 * @param {Object} environment Represents the environment to be interacted with
 * @param {String} webDavImportFile Represents the path of the storefront-data archive to upload
 * @param {String} token Represents the authentication token to use to verify the environment
 * @param {Function} processCallback Represents the callback function to execute once processing has completed
 */
function importSiteData(environment, webDavImportFile, token, processCallback) {

    // Announce that we've started the site-import process
    console.log(` ${environment.instanceName}| -- importing [${webDavImportFile}] via the B2C Commerce instance`);

    // Take the archive and attempt to upload the code version that's been zipped
    ccci.instance.import(environment.instanceUrl, webDavImportFile, token, function (jobDetails, errorObj) {

        // Was an error caught? If so, then throw the error
        if (errorObj !== null && errorObj !== undefined) { throw errorObj; }

        // Were any job-details found?
        if (jobDetails === null || jobDetails === undefined) {

            // If not, call out the error an assume that another job is in progress
            console.log(` ${environment.instanceName}| -- error importing job; please check the instance error-logs for details regarding this failure`);

        } else {

            // Otherwise, explain that job is in progress
            console.log(` ${environment.instanceName}| -- processing job:${jobDetails.job_id} | jobId:${jobDetails.id}`);

            // Retrieve the job status for the import site-data job
            getJobStatus(environment, jobDetails, token, processCallback);

        }

    });

}

module.exports = importSiteData;