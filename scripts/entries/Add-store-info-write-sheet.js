import { Data } from "../classes";
import { FILE_PATH } from "../constant";
import Native from "../native";
import { log, writeSheet, writeTo } from "../util";
import "../main";

try {
  main();
} catch (e) {
  log(`Add-store-info-write-sheet.js: ${e}`);
}

function main() {
  // add_store_form.html 에서 받은 데이터
  const type = Native.local("type");
  const store = Native.local("store");
  const memo = Native.local("memo");
  writeTo(FILE_PATH, `${type};${store};${memo}\n`);

  const price = Native.local("price");
  const data = new Data({
    price,
    type,
    memo,
  });
  writeSheet(data);
}
