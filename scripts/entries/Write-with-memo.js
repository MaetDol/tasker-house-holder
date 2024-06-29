import { Data } from "../classes";
import Native from "../native";

main();

function main() {
  Data.fromNotifyFormat(Native.local("par1")).toLocal();
}
