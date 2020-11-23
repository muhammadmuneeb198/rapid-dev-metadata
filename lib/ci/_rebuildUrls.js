'use strict';

// Initialize any required modules
const ccci = require('sfcc-ci');
const config = require('config');

// Initialize any local function libraries
const getJobStatus = require('./_getJobStatus');

/**
 * @function reIndexSiteData
 * @description Attempts to re-index the storefront product and content indexes
 *
 * @param {Object} environment Represents the environment to be interacted with
 * @param {String} token Represents the authentication token to use to verify the environment
 * @param {Function} processCallback Represents the callback function to execute once processing has completed
 */
function reIndexSiteData(environment, token, processCallback) {

    // Initialize local variables
    let jobDetails,
        reIndexJobName;

    // Retrieve the name of the job used to kick-off the re-index
    reIndexJobName = config.get('rebuildJobName');

    // Announce that we've started the re-index process
    console.log(` ${environment.instanceName}| -- re-building storefront urls`);

    // Execute the re-index job for the current environment
    ccci.job.run(environment.instanceUrl, reIndexJobName, {}, token, function (errorObj, responseObj) {

        // Was an error caught? If so, throw the error
        if (errorObj !== null) {
            throw errorObj;
        }

        // Check if the response includes a body property
        if (!responseObj.hasOwnProperty('body')) {
            throw Error('Body element not found in OCAPI response; aborting');
        }

        // Shorthand the response body
        jobDetails = responseObj.body;

        // Were any job-details retrieved from the response?
        if (jobDetails === null || jobDetails === undefined) {

            // If not, call out the error an assume that another job is in progress
            console.log(` ${environment.instanceName}| -- error executing rebuildUrls job; please check the instance error-logs for details regarding this failure`);

            // Was a fault-element included in the response's body?
        } else if (jobDetails.hasOwnProperty('fault')) {

            // If not, call out the error an assume that another job is in progress
            console.log(` ${environment.instanceName}| -- ${jobDetails.fault.type}: ${jobDetails.fault.message}`);

        } else {

            // Otherwise, explain that job is in progress
            console.log(` ${environment.instanceName}| -- processing job:${jobDetails.job_id} jobId:${jobDetails.id}`);

            // Retrieve the job status for the import site-data job
            getJobStatus(environment, jobDetails, token, processCallback);

        }

    });

}

module.exports = reIndexSiteData;