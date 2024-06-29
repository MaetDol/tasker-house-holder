import { Data } from './classes.js';
import {
  FILE_DIR,
  FILE_PATH,
  GLOBAL_UPDATED_DATE,
  GMT_PARALLAX,
} from "./constant.js";
import Native from "./native.js";
import { now } from "./utils/date-utils.js";

export function isDirExists( path ) {
  try {
    Native.listFiles(path);
  } catch (_) {
    return false;
  }
  return true;
}

export function createDirectory( path ) {
  Native.createDir(path, true);
}

export function writeTo( path, str ) {
  Native.writeFile(path, str, true);
}

export function getStore( store ) {
  const stores = Native.readFile(FILE_PATH)
    .split("\n")
    .map((r) => r.split(";"))
    .map(([type, store, memo]) => new Data({ type, store, memo }));
  return stores.find( s => s.get('store') === store );
}

export function clearNotify(){
  Native.performTask("🏡 Clear notify", 10);
}

export function notify({ title, text }) {
  Native.performTask("🏡 Notify", 1, title, text);
}

export function notifyNewStore( data ) {
  Native.performTask("🏡 Notify new store", 1, data.toNotifyFormat());
}

export function writeSheet( data ) {
  Native.performTask("🏡 Write google sheet", 9, data.toSheetFormat());
}

export function log(msg) {
  const logName = `${FILE_DIR}/log_${now().year}${now().month.padStart(
    2,
    "0"
  )}${now().date.padStart(2, "0")}`;
  const timestamp = new Date(Date.now() + GMT_PARALLAX)
    .toISOString()
    .slice(0, -5);

  writeTo(logName, `[${timestamp}] ${msg}\n`);
}
