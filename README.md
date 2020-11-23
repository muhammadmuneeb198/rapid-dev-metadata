# SFCC-CI: Importing Storefront Reference Architecture (SFRA) Data

This repository provides a demonstration of how to manage storefront data via version control, and automate the import of this data via [sfcc-ci](https://github.com/SalesforceCommerceCloud/sfcc-ci).  Please note that the data stored in this repository is a representation of SFRA data, and not intended to serve as the master or source of this data.  To obtain the latest version of SFRA data, please visit the [storefront-reference-architecture-data](https://github.com/SalesforceCommerceCloud/storefrontdata). repository.
> This codebase is designed to provide an example of how storefront data can be deployed to an environment using [sfcc-ci](https://github.com/SalesforceCommerceCloud/sfcc-ci).  The data in this repository should __NOT__ be used as the source or authoritative master of the storefront reference architecture site-data.
> Ideally, teams can copy this repository -- and replace the placeholder SFRA data with their own storefront's data.

## Repository Links for Editorial Assets
One of the conventions employed by this demo is the separation of storefront assets from the catalog -- allowing both to be managed separately via independent version control repositories.  You can access the repository containing the editorial assets (catalog, slot, editorial, and static images) via the link below.

- [sfcc-ci-assets-upload repository](https://github.com/SalesforceCommerceCloud/sfcc-ci-assets-upload) contains all editorial assets (catalog and slot images) leveraged by the storefront reference architecture.  This repository also serves as an example of how to manage editorial assets via version-control, and automate their deployment using CI tools for B2C Commerce.

## About This Repository
This repository contains the .xml and .json configuration files that comprise a standard site import.  You can .zip the files in the site-data directory to create a site-import archive that can be processed by the Business Manager Site Import.

> Please remember that one of the site-import rules enforced by Business Manager is that the archive's file-name must match its root-folder name.  If the root folder of the archive does not share the same name as the archive, Business Manager will prevent the site-import from being processed -- and throw an error explaining this mismatch.

## Manual Archive and Storefront Import Instructions
Please use these instructions to manually create the storefront archive and import it via Business Manager.

- Locate the 'site-data' directory from the root of this repository.
- Create a .zip archive of the 'site-data' folder and its contents.  Name the archive 'sfra-data.zip'.

> The name of the archive and the root-folder within the archive must have the same name.  Please remember to follow this convention, as the site-import will fail if a name-mismatch exists between these two properties of the site-import archive.

- Log into Business Manager with a user account that has Administrative rights.
- From the Administration Menu, select the 'Site Import & Export' option available under the 'Site Development' menu.
- Upload the archive to the B2C Commerce environment by first selecting the file locally via the 'Choose File' button.
- Select the file by finding it on your local file-system.
- With the file selected, click on the 'Upload' button to move the archive to the environment.
- Wait for the file to complete its upload.  Once uploaded, select the file by clicking on its radio button.
- Import the site archive by clicking on the 'Import' button displayed at the bottom of the archive grid.

> During the import process, you can refresh the display to see if the import is still in progress by clicking on the 'Refresh' button in the bottom left portion of the display.

Once this process has been completed, you can rebuild the indexes and storefront-urls for this site via Business Manager.  Once these two activities have been completed, your storefront should be ready for browsing.

## Automated Site Import Instructions
This repository includes build-scripts which can be used to automate the archiving, uploading, import, and index-rebuild for the SFRA storefront.  To take advantage of this automation, please install the pre-requisites outlined in the following section.

#### Setup a .env file
To begin, we use the [dotenv](https://medium.com/@thejasonfile/using-dotenv-package-to-create-environment-variables-33da4ac4ea8f) node.js library to store environment-specific configuration settings that are then used to authenticate against a given B2C Commerce environment.  Before installing any of the project package dependencies, please follow these instructions to build-out a .env file that contains your environment configuration settings.

- Create a new file named '.env' in the root of the repository.

> This file shouldn't be checked into the repository, and is automatically being ignored by .git

- Open the .env file and add the following information.  Please update these values to reflect your sandbox environment's configuration properties.

```
INSTANCEURL=mysandboxdomain-inside-na01-dw.demandware.net
INSTANCENAME=mysandboxnickname
CLIENTID=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
CLIENTSECRET=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
```

> Prior to saving your file, please verify that the url is correct, and that the clientId / clientSecret are accurate.  The instance name should represent a shorthand nickname for the B2C Commerce environment.  This information must be accurate in order for these activities to successfully process the site-import.

The build tools will use this information to remotely authenticate against your environment via OCAPI prior to attempting any import, upload, or re-index activity.  Once the .env file is created, we can move forward with enabling OCAPI and WebDAV permissions.

#### Configure Your OCAPI Permissions
The build scripts in this repository leverage the [sfcc-ci](https://github.com/SalesforceCommerceCloud/sfcc-ci) automation library.  This library is used to perform a number of continuous-integration related activities that enable the site-data uploading, import, and re-index activities.  Before we can leverage the automation tasks, the Salesforce B2C Commerce environment's OCAPI Data API permissions must be enabled to support remote interactions.

- Log into the Business Manager.
- Navigate to Administration > Site Development > Open Commerce API Settings.
- Select 'Data API' and 'Global' from the available select boxes.
- Add the following permission set for your clientId to the existing configuration settings.

> Remember to replace 'my_client_id' with the clientId that is configured in your .env file.  If you already have clientId permissions created, please add the resources outlined in the snippet below to the existing clientId configuration.

```json
{
  "client_id":"my_client_id",
  "resources":
  [
    {
      "resource_id":"/code_versions",
      "methods":["get"],
      "read_attributes":"(**)",
      "write_attributes":"(**)"
    },
    {
      "resource_id":"/code_versions/*",
      "methods":["patch"],
      "read_attributes":"(**)",
      "write_attributes":"(**)"
    },
    {
      "resource_id":"/jobs/*/executions",
      "methods":["post"],
      "read_attributes":"(**)",
      "write_attributes":"(**)"
    },
    {
      "resource_id":"/jobs/*/executions/*",
      "methods":["get"],
      "read_attributes":"(**)",
      "write_attributes":"(**)"
    }
  ]
}
```
#### Configure Your WebDAV Permissions
The build scripts in this repository require that the clientId configured in the .env file also have read / write WebDAV permissions.  Please use the following instructions to configure the WebDAV permissions for your clientId.

- Log into the Business Manager.
- Navigate to Administration > Organization > WebDAV Client Permissions.
- Add the following permission sets for your clientId to the existing configuration settings.

> Remember to replace 'my_client_id' with the clientId that is configured in your .env file.  If you already have clientId permissions created, please add the resources outlined in the snippet below to the existing clientId configuration.

```json
{
  "clients": [
    {
      "client_id": "myclient_id",
      "permissions": [
        {
          "path": "/cartridges",
          "operations": [
            "read_write"
          ]
        },
        {
          "path": "/impex",
          "operations": [
            "read_write"
          ]
        }
      ]
    }
  ]
}
```

### Node.js Build Prerequisites
The automation scripts in this repository require Node.js [v8.12.0](https://nodejs.org/en/blog/release/v8.12.0/) or greater.  There are a number of recommended options for downloading this [version](https://nodejs.org/en/blog/release/v8.12.0/) of node.js.  We've included the most popular ones below:

- Download the installation archive(s) directly from the [node.js distributions site](https://nodejs.org/dist/v8.12.0/).  From here, you can download the Windows, MacOS, and Linux installers for [v8.12.0](https://nodejs.org/en/blog/release/v8.12.0/)
- Download and [install a specific version](https://medium.com/@katopz/how-to-install-specific-nodejs-version-c6e1cec8aa11) of nodes.js via [Homebrew](https://brew.sh/) for MacOS.
- Download and install multiple versions of node.js via [nvm (node version manager)](https://github.com/creationix/nvm#installation).  Node Version manager allows users to install multiple versions of node.js and select which one to use for a specific directory or project.

> Of these three items, we strongly recommend learning how to use __nvm__.  It provides the most flexibility and once installed, is very easy to use.  If you plan on working with multiple storefronts or reference architectures and cannot standardize on the version of node.js to use for each, then please use nvm to setup custom instances of node.js for each repository.

### Install Project Dependencies
With node.js installed and configured -- we can move forward with the installation core project dependencies.  To make the initial installation and deployment of the storefront-data easier, a number of helper / support scripts have been created to automate and simplify the day-to-day working interactions with the storefront data.

### Install the Core Package Dependencies
Please use these instructions to install the core project dependencies.

- Open a terminal or console window at the repositories' root directory.
- From the root directory, validate that you have node.js version 8.12.0 installed by executing the following command.

```bash
node --version
```

> This command should respond with __v8.12.0__ on the next line in your terminal window.

- Kick-off the core project dependencies' installation with the following command.

```bash
npm install
```

> This command will install all the core dependencies based on the contents of the package.json found in the root directory of the repository.  Please confirm that no errors are reported during the installation process before moving forward with the next step.

### Build and Deploy the Storefront Site-Data
We've implemented a number of npm commands that can be used to create the site-import archive, upload the archive to the B2C Commerce environment's /ImpEx folder, trigger a site-import of that archive, and re-index the storefront's product and content search-indexes.  We've also "rolled-up" each of these commands into a single command that can be used to execute all of these activities in sequence.  A summary of each command is include below

#### Create a .zip Archive of the sfra-data Storefront Data
You can build an archive of the sfra-data site data via the **data:zip** command.

```bash
npm run data:zip
```

Executing this command will create the .zip archive of the [site-data/sfra-data](site-data/sfra-data) directory, and write it to the root directory of the repository.  Please note that this command must be performed prior to executing the upload or import commands detailed in this document.

> To change the name of the generated archive or the location where it is written, please review the [config/default.json](config/default.json) file.  This file is used to manage configuration properties leveraged by the automation tools.

#### Upload the site-import Archive to the B2C Commerce ImpEx WebDAV Folder
With the archive created, the **data:upload** command can be used to upload the archive to the ImpEx folder -- where it can be imported via the configured B2C Commerce storefront.

```bash
npm run data:upload
```

Once uploaded, the storefront data can be imported.  Please note that this archive must be manually deleted (either via Business Manager or through WebDAV).  The automation tooling will overwrite an existing version of the archive -- but will not delete the archive from the ImpEx folder.

#### Import the Uploaded site-import Archive
With the archive uploaded to the WebDAV ImpEx folder, the archive can now be imported via the B2C Commerce environment.

```bash
npm run data:import
```

Executing this command will remotely trigger the import of the site-import archive that was uploaded to the WebDAV ImpEx folder in the previous step.  The import occurs in "merge" mode, so no data from the storefront is deleted.

#### ReIndex the Storefront and Rebuild Storefront Urls
With the storefront data successfully imported, the remaining activities to perform include rebuilding the site product and content search-indexes and the storefront urls.  These items can be rebuild via the **data:reindex** command.

```bash
npm run data:reindex
```

Executing this command will trigger the remote processing of the [sfra-data-reIndexSite](site-data/sfra-data/jobs.xml) job included in the [sfra-data](site-data/sfra-data) directory.  The job first rebuilds / re-indexes the product, content, and active-data search indexes.  Once completed, the job will rebuild the storefront urls.

#### Consolidate the Zip, Upload, Import, and ReIndex Commands
The **data:deploy** command can be used to perform each of the previous commands outlined in this document in sequence.

```bash
npm run data:deploy
```

Executing this command will produce the same outcome as executing the **data:zip**, **data:upload**, **data:import**, and **data:reindex** commands individually in this sequence.  So, once your .env file is created, OCAPI and WebDAV permissions updated, node.js version and package dependencies are installed -- you can trigger the import of the storefront data with this singular command.

### Build and Deploy the Storefront Releases
You can use this complete command-set to also deploy individual releases stored in the [_releases](_releases) directory.  Releases have a few pre-requisites that need to be followed:

- Each release should be created with a unique name at the root of the [_releases](/_releases) directory
- Within that directory, the first sub-directory should also share the same name
- All release-specific storefront data-assets should be placed within the first sub-directory

> This directory structure needs to be followed verbatim, as B2C Commerce requires site import archives to have the __archive name match the top-level directory__ in the archive.  If this convention is not followed, the import-process will fail as the B2C Commerce instance will not process the site import.

With this directory structure in place -- individual releases can be deployed by appending the __-r__ or __--release__ argument to the CLI command and follow it with the release to target.  The following two command examples demonstrate how to leverage this argument with the existing command-set.

```bash
npm run data:zip -r homepage-update
```

```bash
npm run data:zip --release homepage-update
```

> The [homepage-update](/_releases/homepage-update) and [homepage-revert](/_releases/homepage-revert) releases will toggle the SFRA homepage title from 'Summer Style' to 'Homepage Updated via SFCC-CI Data Import' and back.  You can use these sample releases to test deploying incremental storefront changes.

In this example, both of these commands will produce the same outcome and perform the following steps:

- Check the contents of the [_releases](/_releases) directory for a sub-directory named __homepage-update__.
- Confirm that the folder exists -- and throw a hard error if the directory does not exist
- If the folder exists, the contents of the [_releases/homepage-update](/_releases/homepage-update) directory will be zipped into an archive
- The archive will be given the name __homepage-update.zip__ and copied to the repository root

> The __-r__ or __--release__ CLI arguments can be leveraged by the __data:zip__, __data:upload__, and __data:import__ commands.  Please note that the __data:reindex__ and __data:rebuild__ commands do not require the release argument, as their work is performed against the SFRA site hosted by the configured Salesforce B2C Commerce instance.

## What's Next?
As always, feedback is welcome.  You're also invited to log an issue if you see something that isn't working as expected or can be improved.  You're also invited to extend this if you see opportunities to enhance the CI delivery of storefront data.  We hope you find this helpful -- and look forward to hearing from you.