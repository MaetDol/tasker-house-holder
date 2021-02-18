
function isDirExists( path ) {
  try { listFiles( path ); } 
  catch(_) { return false; }
  return true;
}

function createDirectory( path ) {
  createDir( path, true );
}

function writeTo( path, str ) {
  writeFile( path, str, true );
}

function now() {
  const time = new Date( Date.now() + GMT_PARALLAX );
  return {
    time,
    month: `${time.getUTCMonth() + 1}`,
    date: `${time.getUTCDate()}`,
  }; 
}

function isFirstWriteOfToday() {
  const lastWriteDate = global( GLOBAL_UPDATED_DATE );
  return lastWriteDate !== now().date;
}

function getStore( store ) {
  const stores = readFile( FILE_PATH )
    .split('\n')
    .map( r => r.split(';'))
    .map(([type, store, memo]) => new Data({type, store, memo}));
  return stores.find( s => s.get('store') === store );
}

function clearNotify(){
  performTask('🏡 Clear notify');
}

function notify({ title, text }) {
  performTask('🏡 Notify', 1, title, text );
}

function notifyNewStore( data ) {
  performTask('🏡 Notify new store', 1, data.toNotifyFormat() );
}

function writeSheet( data ) {
  performTask('🏡 Write google sheet', 1, data.toSheetFormat() );
}

