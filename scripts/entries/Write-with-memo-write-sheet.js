import { Data } from "../classes";
import Native from "../native";
import { writeSheet } from "../util";
import "../main";

main();

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
