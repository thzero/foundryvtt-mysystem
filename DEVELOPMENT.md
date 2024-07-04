# Development using thZero/foundryvtt-mysystem

To develop with mysystem, you will need to do the following:

* Verify that you have NodeJs running on your system.
 * Use the latest release compatible with FoundryVTT.
* Setup a local instance of FoundryVTT.
* Identify the location of your data folder for FoundryVTT.
 * This is the folder that contains the following sub-folders: Config, Data, and Logs
* Clone this repository.
* Setup the development tools.

## Developer Tooling

Recommendation is to use VSCodium for development, although any quality programming editor will work.
NPM or equivalent, such as yarn, is required.

## Development Setup

### Dependencies

Run the following command to install all the development and runtime dependencies.

```
npm install
```

### Build

Then run the build process to build the distribution files.

```
npm run build
```

## Linking development environment to FoundryVTT

The system files in your local FoundryVTT instance must be synced with the project's distribution files.  To do so, you need to link the project's distrirbution folder, dist, to your FoundryVTT's data directory. order for the project's build task to update the system files in your Foundry instance, you need to link the project's dist directory to your Foundry data directory. This can be done automatically by gulp. To do so, edit foundryconfig.json with the path to your Foundry data directory, then run the link script:

### Configuration

In order to link follow these steps.

* Create a copy of the blank.foundryconfig.json
* Rename the copy to 'foundryconfig.json'.
* Edit the 'dataPath' property with the location of your FoundryVTT's data directory.
 * If on Windows, use double slashes for path seperation.

### Linking

To link, run the following command which will create a symlink between your project's 'dist' folder and the FoundryVTT data directory as 
'systems\mysystem'.

```
gulp link
# or
npm run link
```

#### Linking in Windows

On Windows, the above script must be run using an administrator command prompt/Powershell.

* Windows key
* Type in 'cmd'
* On the Command Prompt search result, click the 'Run as Administor' link.
 * Alternatively, right-click on the Command Prompt icon and select 'Run as Administrator'.
* Navigate to your project folder's root directory.
* Run the command from the Linking section.

## Building

To build or rebuild the distribution files, use the following build script.

```
npm run build
```

## Development Server

With the system built and linked, you can use the development server provided by Vite to ease development.

To launch the server, make sure your local instance FoundryVTT that you linked to is running on port 30000, then run the following command.

```
npm run serve
```

This will launch a web browser and connect to http://localhost:30001/ which is the Vite development server.  The Vite development servers sitsbetween your browser and FoundryVTT, allowing it to quickly replace files that were changed and reload FoundryVTT, and in addition hot reload any modules configured for it. [Details can be found on the FoundryVTT community wiki page.](https://foundryvtt.wiki/en/development/guides/vite)
