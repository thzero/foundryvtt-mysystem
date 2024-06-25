console.log('mysystem | hello')

// Initialize system
Hooks.once('init', async () => {
  console.log('mysystem | Initializing mysystem');

  // Assign custom classes and constants here
//   registerSystem();

  // Register custom system settings
//   registerSettings();

  // Preload Handlebars templates
//   await preloadTemplates();
//   registerHandlebarsHelpers();

  // Register custom sheets (if any)
});

// Setup system
Hooks.once('setup', async () => {
  // Do anything after initialization but before ready
});

// When ready
Hooks.once('ready', async () => {
//   await handleMigrations();
//   sendDevMessages();
//   await importDocuments();
});

// Add any additional hooks if necessary
// integrateExternalModules();
// registerFonts();

// Register other