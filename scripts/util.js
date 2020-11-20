
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

/*
  TODO: create 'Clear notify' Task
*/
function clearNotify( title ) {
  performTask('Clear notify', 1, title );
}

function now() {
  const time = new Date( new Date() + GMT_PARALLAX );
  return {
    time,
    date: time.getUTCDate().toString(),
  }; 
}

function isFirstWriteOfDay() {
  const lastWriteDate = global( GLOBAL_UPDATED_DATE );
  return lastWriteDate === now().date;
}

function getStore( store ) {
  const stores = readFile( FILE_PATH )
    .split('\n')
    .map( r => r.split(';'))
    .map(([type, store, memo]) => new Data({type, store, memo}));
  return stores.find( s => s.get('store') === store );
}

/*
  TODO: Implement notify and Task
*/
function notify({ title, text }) {
  performTask('Notify', 1, title, text );
}

function notifyNewStore( str ) {
  performTask('Notify new store', 1, str );
}
