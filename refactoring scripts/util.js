
function isDirExist( path ) {
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

function parseData( data ) {
  return data.split( DATA_SEPARATOR );
}

/*
  TODO: create 'Clear notify' Task
*/
function clearNotify( title ) {
  performTask('Clear notify', 1, title );
}

/*
  TODO: create 'Write google sheet' Task
*/
function writeSheet( data ) {
  performTask('Write google sheet', 1, data );
}

function getStore( store ) {
  const stores = readFile( FILE_PATH )
    .split('\n')
    .map( r => r.split(';'))
    .map(([type, store, memo]) => {type, store, memo});
  return stores.find( s => s.store === store );
}

/*
  TODO: Implement notify and Task
*/
function notify({ title, text }) {
}