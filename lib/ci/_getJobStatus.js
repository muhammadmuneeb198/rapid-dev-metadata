'use strict';

// Initialize required libraries
const ccci = require('sfcc-ci');
const config = require('config');
const moment = require('moment');
const AsyncPolling = require('async-polling');

// Define the polling interval
const pollingInterval = config.get('pollingInterval');
const validPollingStates = config.get('validPollingStatuses');

/**
 * @function getJobStatus
 * @description This function is used to report on the job-status for a given B2C Commerce scheduled
 * job currently in flight; it polls via OCAPI to retrieve the job status at a configured interval
 *
 * @param environment {Object} Describes the Salesforce B2C Commerce environment
 * @param jobDetails {Object} Describes the job-details / identification of the job being queried
 * @param token {String} Represents the authorization token used to inquire re: job-status
 * @param pollingCallback {Function} Represents the callback function to execute
 */
function getJobStatus(environment, jobDetails, token, pollingCallback) {

    // Otherwise, let's poll for the status of the job
    /** @type AsyncPolling **/
    let polling = AsyncPolling(function (end) {

        // Query the job status for the data import
        ccci.job.status(
            environment.instanceUrl,
            jobDetails.job_id,
            jobDetails.id,
            token,
            function (statusResult) {
                end(null, statusResult);
            });

        // Specify the interval and kick-off the polling
    }, pollingInterval);

    // Inspect the polling results
    polling.on('result', function (jobStatus) {

        // Debugging: Call out the current polling status for the job being processed
        console.log(` ${environment.instanceName}| -- ${jobStatus.job_id}.${jobStatus.id} | ${moment().format('LTS')} | ${jobStatus.status} (${jobStatus.execution_status})`);

        // Was an 'OK' status provided?
        if (jobStatus.status === 'OK') {

            // Stop the polling
            this.stop(pollingCallback(jobDetails));

            // Was an non-valid / expected polling status provided
        } else if (validPollingStates.indexOf(jobStatus.status) === -1) {

            // Debugging: If so, then output the current polling state
            console.log(` ${environment.instanceName}| -- error / invalid polling state: ${jobStatus.status}`);

            // Stop the polling
            this.stop(pollingCallback(jobDetails));

        }

    });

    // Debugging: Call-out that polling has started
    polling.on('run', function () {

        // Debugging: Audit and call-out that polling has started / describe the interval
        console.log(` ${environment.instanceName}| ---- polling started for ${environment.instanceUrl}`);
        console.log(` ${environment.instanceName}| ---- polling interval set to ${pollingInterval}ms`);

    });

    // Kick off the polling logic
    polling.run();

}

module.exports = getJobStatus;