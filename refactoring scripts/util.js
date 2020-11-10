
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
  const str = formattingSheetForm( data );
  performTask('Write google sheet', 1, str );
}

function formattingSheetForm({ price, type, memo }) {
  const columns = [price, type, memo].join( DATA_SEPARATOR );
  let datePrefix = '';
  if( isFirstWriteOfDay() ) {
    setGlobal( GLOBAL_UPDATED_DATE, now().date );
    datePrefix = ROW_SEPARATOR + now().date;
  }
  datePrefix += DATA_SEPARATOR;
  return datePrefix + DATA_SEPARATOR + columns;
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
    .map(([type, store, memo]) => {type, store, memo});
  return stores.find( s => s?.store === store );
}

/*
  TODO: Implement notify and Task
*/
function notify({ title, text }) {
  performTask('Notify', 1, title, text );
}

function notifyNewStore({ store, price, type }) {
  const data = [store, price, type].join( DATA_SEPARATOR );
  performTask('Notify new store', 1, data );
}