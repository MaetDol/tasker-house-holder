
function createPlaceholder( name ) {
	if (globalThis[name]) {
    return globalThis[name].bind(globalThis);
  }

  return function () {
    console.log(`Call native function ${name}`);
    return name;
  };
}

const Types = [
	'global',
	'listFiles',
	'createDir',
	'writeFile',
	'readFile',
	'performTask',
	'exit',
];

export default Types.reduce((Native, name) => {
	Native[name] = createPlaceholder( name );
	return Native;
}, {});
