
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
	
	try {
	if (typeof eval(name) === "function") {
		return eval(name);
	}
} catch(e) {}

  return function () {
    console.log(`Call native function ${name}`);
    return name;
  };
}

const Types = /** @type {const} */ ([
  "setLocal",
  "local",
  "setGlobal",
  "global",
  "listFiles",
  "createDir",
  "writeFile",
  "readFile",
  "performTask",
  "exit",
]);

/** @type {Record<typeof Types[number], Function>} */
const Native = Types.reduce((Native, name) => {
  Native[name] = createPlaceholder(name);
  return Native;
}, {});

export default Native;