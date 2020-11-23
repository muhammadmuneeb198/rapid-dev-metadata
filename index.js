'use strict';

// Initialize constants
const async = require('async');

// Initialize the ci-deployment command functions
const zipStorefrontData = require('./lib/cli-commands/_zipStorefrontData');
const uploadStorefrontData = require('./lib/cli-commands/_uploadStorefrontData');
const importStorefrontData = require('./lib/cli-commands/_importStorefrontData');
const reIndexStorefront = require('./lib/cli-commands/_reIndexStorefront');
const rebuildStorefrontUrls = require('./lib/cli-commands/_rebuildStorefrontUrls');

// Initialize the program
let program = require('commander');

// Initialize the version
program.version('0.5.0');

program
    .command('data:zip')
    .option('-r, --release <release>', 'Describes the name of the release folder from which to generate an import-archive.')
    .description('Attempts to .zip the specified directory -- representing a storefront data-import.')
    .action(function (releaseName) {

        // Create the site / release archive
        zipStorefrontData(releaseName);

    });

program
    .command('data:upload')
    .option('-r, --release <release>', 'Describes the name of the release to upload to the configured B2C Commerce environment.')
    .description('Attempts to upload a storefront-data archive to the configured B2C Commerce instance.')
    .action(function (releaseName) {

        // Upload a given storefront data archive
        uploadStorefrontData(releaseName);

    });

program
    .command('data:import')
    .option('-r, --release <release>', 'Describes the name of the import file to process.')
    .description('Kicks off a remote storefront-data import for the uploaded site-data.')
    .action(function (releaseName) {

        // Import a given storefront data archive
        importStorefrontData(releaseName);

    });

program
    .command('data:reindex')
    .description('Kicks off a remote index for the uploaded site-data.')
    .action(function () {

        reIndexStorefront();

    });

program
    .command('data:rebuild')
    .description('Kicks off a remote storefront url-rebuild for the uploaded site-data.')
    .action(function () {

        rebuildStorefrontUrls();

    });

program
    .command('data:deploy')
    .option('-r, --release <release>', 'Describes the name of the release to process.')
    .description('Batch command that can be used to zip, upload, import, and re-index for a given site import.')
    .action(function (releaseName) {

        console.log('-----------------------------------');
        console.log(' SFCC-CI | START: npm deploy');
        console.log('-----------------------------------');

        // Attempt the file-import
        async.series([

            // Zip the archive
            function zipArchive(asyncCallback) {

                // Zip the storefront data
                zipStorefrontData(releaseName, asyncCallback);

            },

            // Upload the archive
            function uploadArchive(asyncCallback) {

                // Upload the archive for the current release
                uploadStorefrontData(releaseName, asyncCallback);

            },

            // Import the archive
            function importSite(asyncCallback) {

                // Import the archive for the current release
                importStorefrontData(releaseName, asyncCallback);

            },

            // Re-Index the storefront
            function reIndexSite(asyncCallback) {

                // ReIndex the storefront's search indexes
                reIndexStorefront(asyncCallback);

            },

            // Rebuild storefront urls
            function rebuildStorefrontUrls(asyncCallback) {

                // Rebuild storefront urls
                rebuildStorefrontUrls(asyncCallback);

            }

        ], function(asyncErrorObj) {

            // Was an error defined?  If so, then throw it
            if (asyncErrorObj !== null) { throw asyncErrorObj; }

            console.log('-----------------------------------');
            console.log(' SFCC-CI |  END: npm deploy');
            console.log('-----------------------------------');

        });

    });


// Parse the command-line arguments
program.parse(process.argv);
