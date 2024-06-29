import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const entryDir = path.resolve(__dirname + "/scripts/entries");
const entryFiles = fs.readdirSync(entryDir);

console.log(entryFiles);

const entryBuildOptions = entryFiles.map((file) => ({
  input: path.resolve(entryDir, file),
  output: {
    dir: "dist/",
    format: "es",
  },
  onwarn: (warning, warn) => {
    if (warning.code === "EVAL") return;
    warn(warning);
  },
}));

export default entryBuildOptions;
