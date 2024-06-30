import { Data } from "../classes";
import Native from "../native";
import "../main";

main();

function main() {
  Data.fromNotifyFormat(Native.local("par1")).toLocal();
}
