import { Logger } from './Logger';

export async function copyToClipboard(textToCopy: string) {
	// @ts-expect-error
	await game.clipboard.copyPlainText(textToCopy);
	// @ts-expect-error
	ui.notifications.info('Copied to clipboard'); // TODO: i81n?
}

export function getKeyByValue(object: any, value: any) {
	return Object.keys(object).find((key) => object[key] === value);
}

export function isObject(value: any) {
	return (!!value && (typeof value === 'object') && !Array.isArray(value));
}