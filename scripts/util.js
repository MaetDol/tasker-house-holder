import { Data } from './classes.js';
import Native from "./native.js";

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

export function now() {
  const time = new Date( Date.now() + GMT_PARALLAX );
  return {
    time,
    month: `${time.getUTCMonth() + 1}`,
    date: `${time.getUTCDate()}`,
  }; 
}

export function isFirstWriteOfToday() {
  const lastWriteDate = Native.global(GLOBAL_UPDATED_DATE);
  return lastWriteDate !== now().date;
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

