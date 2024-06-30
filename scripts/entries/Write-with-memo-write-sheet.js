import { Data } from "../classes";
import Native from "../native";
import { log, writeSheet } from "../util";
import "../main";

try {
  main();
} catch (e) {
  log(`Write-with-memo-write-sheet.js: ${e}`);
}

function main() {
  const price = Native.local("price");
  const type = Native.local("type");
  const memo = Native.local("memo");

  const data = new Data({
    price,
    type,
    memo,
  });

  writeSheet(data);
}
