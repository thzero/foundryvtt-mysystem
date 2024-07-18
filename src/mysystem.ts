/**
 * TypeScript FoundryVTT entry file for mysystem.
 */

// Import msystem SCSS.
import './mysystem.scss';

import './module/index.ts';

import { Logger } from './module/Logger.ts';

// @ts-ignore
// import Font from 'ascii-art-font';
// @ts-ignore
import Font from './module/ascii-font.js';

// Initialize system
Hooks.once('init', async () => {
	console.log(`${game.system.id} | Initializing ${game.system.id}`);

	Logger.info('asdfasdfasdf');

	Font.fontPath = '/systems/mysystem/fonts/';
	// @ts-ignore
	Font.create(game.system.id, 'doom', function(rendered) {
		console.log(rendered);
	});

	// Assign custom classes and constants here
//	 registerSystem();

	// Register custom system settings
//	 registerSettings();

	// Preload Handlebars templates
//	 await preloadTemplates();
//	 registerHandlebarsHelpers();

	// Register custom sheets (if any)
});

// Setup system
Hooks.once('setup', async () => {
	// Do anything after initialization but before ready
	
});

// When ready
Hooks.once('ready', async () => {
//	 await handleMigrations();
//	 sendDevMessages();
//	 await importDocuments();


Logger.info('asdfasdfasdf');
Logger.info('asdfasdfasdf');
Logger.info('asdfasdfasdf');
Logger.info('asdfasdfasdf');
Logger.info('asdfasdfasdf');
Logger.info('asdfasdfasdf');
Logger.info('asdfasdfasdf');
Logger.info('asdfasdfasdf');
ui.notifications.info('hi');
});

// Add any additional hooks if necessary
// integrateExternalModules();
// registerFonts();

// Register other