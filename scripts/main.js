import { log } from './util';

main();

function main() {
	if (typeof window !== 'undefined') {
		window.onerror = function (message, source, lineno, colno, error) {
			log(`GLOBAL: ${message} at ${source}:${lineno}:${colno}
error: ${error}`);
		};
	}
}
