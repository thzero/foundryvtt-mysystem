import fs from 'fs-extra';
import { hideBin } from 'yargs/helpers';

/*
	CONFIGURATION
*/

const packageId = 'mysystem';
const sourceDirectory = './src';
const distDirectory = './dist';
const staticFiles = ['assets', 'fonts', 'lang', 'packs', 'templates', 'system.json', 'template.json'];

/*
	Get the data paths of Foundry VTT based on what is configured in `foundryconfig.json`.
	https://github.com/ClipplerBlood/icrpgme/
*/
function getDataPaths() {
	const config = fs.readJSONSync('foundryconfig.json');
	const dataPath = config?.dataPath;
	
	if (dataPath) {
		const dataPaths = Array.isArray(dataPath) ? dataPath : [dataPath];
	
		return dataPaths.map((dataPath) => {
			if (typeof dataPath !== 'string')
				throw Error(`Property dataPath in 'foundryconfig.json' is expected to be a string or an array of strings, but found '${dataPath}'.`);

			if (!fs.existsSync(path.resolve(dataPath))) {
				throw Error(`The dataPath '${dataPath}' does not exist on the file system.`);
			}
			return path.resolve(dataPath);
		});
	}
	
	throw Error('No dataPath defined in foundryconfig.json.');
}
	
/*
	Link build to User Data folder.
	https://github.com/ClipplerBlood/icrpgme/
*/
export async function link() {
	if (!fs.existsSync(path.resolve(sourceDirectory, 'system.json')))
		throw new Error(`Could not find 'system.json'.`);

	let destinationDirectory = 'systems';
	
	const linkDirectories = getDataPaths().map((dataPath) =>
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