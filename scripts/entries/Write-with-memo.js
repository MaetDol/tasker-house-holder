import { Data } from "../classes";
import Native from "../native";
import "../main";
import { log } from "../util";

try {
  main();
} catch (e) {
  log(`Write-with-memo.js: ${e}`);
}

function main() {
  Data.fromNotifyFormat(Native.local("par1")).toLocal();
}
