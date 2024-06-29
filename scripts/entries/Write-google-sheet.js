import { Spreadsheet } from "../classes";
import { GLOBAL_UPDATED_DATE } from "../constant";
import Native from "../native";
import { clearNotify, log, notify } from "../util";
import { now } from "../utils/date-utils";

main();

function main() {
  clearNotify();
  const month = now().month;

  new Spreadsheet(`${month}`.padStart(2, "0"), Native.local("headers"))
    .append(Native.local("par1"))
    .then(() => {
      Native.flash("Done.");
      Native.setGlobal(GLOBAL_UPDATED_DATE, now().date);
      Native.exit();
    })
    .catch((e) => {
      Native.flash(`Failed append data because: ${e}`);
      notify({
        title: "Failed append pay info",
        text: `
Reason: ${e}
Pay info: ${Native.local("par1")}`,
      });

      log(`Failed append pay info: ${e}`);
    });
}
