
function createPlaceholder( name ) {
	return globalThis[name] || function() {
		console.log(`Call native function ${name}`);
		return name;
	}
}

const Types = [
	'global',
	'listFiles',
	'createDir',
	'writeFile',
	'readFile',
	'performTask'
];

export default Types.reduce((Native, name) => {
	Native[name] = createPlaceholder( name );
	return Native;
}, {});
