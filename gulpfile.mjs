
import path from 'node:path';
import cp from 'child_process';

import gulp from 'gulp';
import fs from 'fs-extra';
import { hideBin } from 'yargs/helpers';
import yargs from 'yargs';

// CONFIGURATION
const packageId = 'mysystem';
const distDirectory = './dist';
const sourceDirectory = './src';
const stylesDirectory = `${sourceDirectory}/styles`;
const stylesExtension = 'scss';
const staticFiles = ['assets', 'fonts', 'lang', 'packs', 'templates', 'system.json', 'template.json'];

/********************/
/*      BUILD       */
/********************/

export async function buildVite() { 
	// forward arguments on serves
	const serveArg = process.argv[2];
	let commands = ['vite', 'build'];
	if (serveArg == 'build' && process.argv.length > 3)
		commands = commands.concat(process.argv.slice(3));
	return cp.spawn('npx', commands, { stdio: 'inherit', shell: true });
}

export const build = gulp.series(cleanDist, generateTemplate, buildVite);

/********************/
/*      CLEAN       */
/********************/
// https://github.com/ClipplerBlood/icrpgme/

/**
 * Remove built files from `dist` folder while ignoring source files
 */
export async function cleanDist() {
	const files = [...staticFiles, 'module'];
	if (fs.existsSync(`${stylesDirectory}/${packageId}.${stylesExtension}`))
		files.push('styles');

	console.log(' ', 'Files to clean:');
	console.log('	 ', files.join('\n		'));

	for (const filePath of files)
		await fs.remove(`${distDirectory}/${filePath}`);
}

export const clean = gulp.series(cleanDist);

/********************/
/*      GENERATE    */
/********************/
/*
	Generate the template file based on actual data types.
*/
export async function generateTemplate() {
	const templateBase = fs.readJSONSync('base.template.json');
	if (!templateBase)
		throw Error(`No base 'template.json'.`);

	const ignore = templateBase.ignore ?? [];
	const defaultHtmlFields = templateBase.default && templateBase.default.htmlFields ? templateBase.default.htmlFields : [];
	
	const dataDirectory = sourceDirectory + '/module/data';
	const folders = fs.readdirSync(dataDirectory, { withFileTypes: true});
	if (!folders)
		throw Error(`No folders in '/src/module/data'.`);

	const templateFile = sourceDirectory + '/public/template.json';
	let template = fs.readJSONSync(templateFile);
	template = Object.assign(template, templateBase);
	delete template.default;
	delete template.ignore;

	const capitalizeFirstLetter = (string) => {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	console.log(`Processing 'template.json'...`);

	let folderName;
	let folderItem;
	let type;
	for (const item of folders) {
		if (!item.isDirectory())
			continue;
		console.log(`\tProcessing '${item.name}'...`);
		if (ignore.indexOf(item.name) > -1) {
			console.log(`\t\tignored`);
			continue;
		}

		folderName = capitalizeFirstLetter(item.name);
		folderItem = template[folderName];
		if (!folderItem) {
			console.log(`\t\tadding folder...`);
			template[folderName] = folderItem = { 
				types: [], 
				htmlFields: defaultHtmlFields 
			};
		}

		folderItem.types = [];

		const files = fs.readdirSync(path.join(dataDirectory, item.name));
		for (const itemF of files) {
			console.log('\t\t' + itemF);
			if (itemF.startsWith('_')) {
				console.log(`\t\t\tignored`);
				continue;
			}
			if (!itemF.endsWith('.mjs')) {
				console.log(`\t\t\tignored`);
				continue;
			}

			type = itemF.replace('.mjs', '');
			console.log(`\t\t\t${type}`);
			if (folderItem.types.indexOf(type) > -1) {
				console.log(`\t\t\texists`);
				continue;
			}
			
			folderItem.types.push(type);
		}
	}
	console.log('...processed.');
	
	fs.writeJSONSync(templateFile, template, {
		spaces: '\t'
	});
}

/********************/
/*      HELP        */
/********************/

export async function help() {
	console.log('-----------');
	console.log('\tnpm run build\t\t - Cleans and builds the distribution files.');
	console.log('\tnpm run clean\t\t - Cleans the distribution files.');
	console.log('\tnpm run dev\t\t - Generates/updates the template.json and launches the dev server.');
	console.log('\tnpm run generate\t - Generates/updates the template.json file.');
	console.log('\tnpm run help\t\t - Help menu.');
	console.log('-----------');
}

/********************/
/*      LINK        */
/********************/
// https://github.com/ClipplerBlood/icrpgme/
	
/*
	Link build to User Data folder.
*/
export async function link() {
	const file = path.resolve(sourceDirectory, 'public/system.json');
	if (!fs.existsSync(file))
		throw new Error(`Could not find '${file}'.`);

	let destinationDirectory = 'systems';
	
	const linkDirectories = _getDataPaths().map((dataPath) =>
		path.resolve(dataPath, 'Data', destinationDirectory, packageId),
	);
	
	const argv = yargs(hideBin(process.argv)).option('clean', {
		alias: 'c',
		type: 'boolean',
		default: false,
	}).argv;

	const clean = argv.c;
	for (const linkDirectory of linkDirectories) {
		if (clean) {
			console.log(`Removing build in ${linkDirectory}.`);
			await fs.remove(linkDirectory);
			continue;
		}

		if (!fs.existsSync(linkDirectory)) {
			console.log(`Linking dist to ${linkDirectory}.`);
			await fs.ensureDir(path.resolve(linkDirectory, '..'));
			await fs.symlink(path.resolve(distDirectory), linkDirectory);
			continue;
		}
		
		console.log(`Skipped linking to '${linkDirectory}', as it already exists.`);
	}
}

/*
	Get the data paths of Foundry VTT based on what is configured in `foundryconfig.json`.
*/
function _getDataPaths() {
	const config = fs.readJSONSync('foundryconfig.json');
	const dataPath = config?.dataPath;
	
	if (!dataPath)
		throw Error(`No dataPath defined in 'foundryconfig.json'.`);

	const dataPaths = Array.isArray(dataPath) ? dataPath : [dataPath];
	return dataPaths.map((dataPath) => {
		if (typeof dataPath !== 'string')
			throw Error(`Property dataPath in 'foundryconfig.json' is expected to be a string or an array of strings, but found '${dataPath}'.`);

		if (!fs.existsSync(path.resolve(dataPath)))
			throw Error(`The dataPath '${dataPath}' does not exist on the file system.`);

		return path.resolve(dataPath);
	});
}

/********************/
/*      SERVER       */
/********************/

export async function serveVite() { 
	// forward arguments on serves
	const serveArg = process.argv[2];
	let commands = ['vite', 'serve'];
	if (serveArg == 'serve' && process.argv.length > 3)
		commands = commands.concat(process.argv.slice(3));
	return cp.spawn('npx', commands, { stdio: 'inherit', shell: true });
}

export const serve = gulp.series(generateTemplate, serveVite);