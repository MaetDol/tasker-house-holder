
function createPlaceholder( name ) {
	if (typeof globalThis !== "undefined") {
		if (typeof globalThis[name] === "function") {
			return globalThis[name].bind(globalThis);
		}
	}

	if (typeof window !== "undefined") {
		if (typeof window[name] === "function") {
			return window[name].bind(window);
		}
	}
	
	if (typeof eval(name) === "function") {
		return eval(name);
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
