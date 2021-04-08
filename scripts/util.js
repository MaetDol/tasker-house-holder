
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

  let result = {match:Infinity, data:null};
  for( const data of stores ) {
    const storeName = data.get('store');
    if( storeName.indexOf(store) === -1 ) continue;

    const match = storeName.length - store.length;
    result = match <= result.match ? {match, data} : result;
  }

  return result.data;
}

function clearNotify(){
  performTask('🏡 Clear notify', 10);
}

function notify({ title, text }) {
  performTask('🏡 Notify', 1, title, text );
}

function notifyNewStore( data ) {
  performTask('🏡 Notify new store', 1, data.toNotifyFormat() );
}

function writeSheet( data ) {
  performTask('🏡 Write google sheet', 9, data.toSheetFormat() );
}

