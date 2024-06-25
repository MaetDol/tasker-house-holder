const FILE_DIR$1 = 'Download/uhab/';
const FILE_PATH$1 = FILE_DIR$1 + 'storeList';

const GMT_PARALLAX$1 = 9 * 60*60*1000;

const GLOBAL_UPDATED_DATE$1 = 'UHAB_last_date';
const GLOBAL_NOTIFY = 'UHAB_last_notify';
const GLOBAL_SHEET_LINK$1 = 'UHAB_spreadsheet_url';

const DATA_SEPARATOR = '™';
const ROW_SEPARATOR = '¶™¶';

function createPlaceholder( name ) {
	return globalThis[name] || function() {
		console.log(`Call native function ${name}`);
		return name;
	}
}

const Types = [
	'global',
	'listFiles',
	'createDir',
	'writeFile',
	'readFile',
	'performTask'
];

var Native = Types.reduce((Native, name) => {
	Native[name] = createPlaceholder( name );
	return Native;
}, {});

const { global: global$2 } = Native;

class Purchase {
  constructor( msg, parserCls ) {
    this.parser = new parserCls( msg );
    this._isNot = false;
    if( this.parser.failed ) {
      this._isNot = true;
    }
  }
  get data() { return this.parser.data; }
  get isNot() { return this._isNot; }
}

class Data {
  constructor({
    price= '',
    type= '',
    store= '',
    memo= '',
  }) { this.data = { price, type, store, memo }; } 

  raw() { return this.data; }
  get( name ) { return this.data[name]; }
  set( name, value ) { this.data[name] = value; }

  toString() {
    return Object.values( this.data ).join( DATA_SEPARATOR );
  }

  toSheetFormat() {
    const {price, type, memo} = this.data;
    let values = [
      ['', '', Number(price), type, memo],
    ];

    if( isFirstWriteOfToday() ) {
      values[0][0] = now().date;
      values.unshift(['']);
    }
    return JSON.stringify({values});
  }

  toNotifyFormat() {
    const {price, type, store} = this.data;
    return [price, type, store].join( DATA_SEPARATOR );
  }

  toLocal() {
    Object.entries( this.data ).forEach(([k,v]) =>
      setLocal( k, v )
    );
  }
  
  static fromNotifyFormat( str ) {
    const [price, type, store, memo] = str.split( DATA_SEPARATOR );
    return new this({ price, type, store, memo });
  }
}

class Parser {
  YEN = 11;
  USD = 1150;
  constructor( msg ) {
    this._failed = false;
    this.exchangeRate = {
      '원': v => this.toNumber(v),
      'KRW': v => this.toNumber(v),
      '엔': v => this.toNumber(v) * this.YEN,
      '달러': v => this.toNumber(v) * this.USD,
    };
    this._parsedData = this.parse( msg );
  }
  parse() { throw 'Override'; }
  toNumber( val ) { return Number( val.replace(/,/g, '') ); }
  get data() { return this._parsedData; }
  get failed() { return this._failed; }
}

class ShinhanCheckParser extends Parser {

  parse( msg ) {
    const isPurchase = msg.match(/신한체크(해외)?승인/);
    if( !isPurchase ) {
      this._failed = true;
      return;
    }

    const TIME_REG = /\d\d\/\d\d\s?\d\d:\d\d\s?/;
    const raw = msg.split( TIME_REG )[1];
    const INFO_REG = /^([^\d\s]*)\s*([-,.\d]+)\s*(\S*)\s+(.+)/;
    const [_, prefix, price, suffix, store] = raw.match( INFO_REG );
    const won = this.exchangeRate[suffix || prefix]( price );

    return new Data({
      price: won,
      store: store,
    });
  }

}

class ShinhanSOLPay extends Parser {
  parse(msg) {
    const isPurchase = /\[신한카드\(\d+\)승인\]/.test(msg);
    if (!isPurchase) {
      this._failed = true;
      return;
    }

    // - 승인일시: 06.25 13:30
    const TIME_REGEXP = /- 승인일시: (\d\d)\/(\d\d) \d\d:\d\d/;
    const STORE_REGEXP = /- 가맹점명: (.+)/;
    // 해외결제는 어떻게?
    const PRICE_REGEXP = /- 승인금액: ([\d,]+)/;

    const price = msg.match(PRICE_REGEXP)[1];
    const store = msg.match(STORE_REGEXP)[1];

    return new Data({
      price: this.exchangeRate["원"](price),
      store: store,
    });
  }
}

class Spreadsheet {

  GET = 'GET';
  UPDATE = 'UPDATE';

  constructor( sheet, auth ) {
    this.sheet = sheet;
    const a = auth.split(':');
    this.auth = { [a[0]]: a[1] };
    this.id = this.#id();
    this.baseUrl = this.#baseUrl();

    this.options = {
      'GET': {
        queryString: 'majorDimension=ROWS',
        options: { 
          headers: this.auth, 
          method: 'GET',
        }
      },
      'UPDATE': {
        queryString: 'valueInputOption=RAW',
        options: { 
          headers: this.auth, 
          method: 'PUT',
        }
      }
    };
  }

  #id() {
    const url = global$2( GLOBAL_SHEET_LINK );
    return url.match(/\/d\/([\w-]+)\/?/)?.[1];
  }

  #baseUrl() {
    return `https://sheets.googleapis.com/v4/spreadsheets/${this.id}`;
  }

  #valuesUrl( sheet, range, queryString ) {
    return `${this.baseUrl}/values/${sheet}!${range}?${queryString}`;
  }

  #request( url, options ) {
    return fetch( url, options )
      .then( r => r.json() )
      .then( r => {
        if( r.error ) {
          throw r.error;
        }
        return r;
      });
  }

  #lastRowIndex() {
    const { queryString, options } = this.options[this.GET];
    const url = this.#valuesUrl( this.sheet, 'C:C', queryString );
    return this.#request( url, options ).then( r => r.values.length );
  }
  
  async append( data ) {
    const lastRow = await this.#lastRowIndex();
    const { queryString, options } = this.options[this.UPDATE];
    const url = this.#valuesUrl( this.sheet, `A${lastRow+1}`, queryString );

    return this.#request( url, {...options, body: data} );
  }
}

const {
  listFiles,
  createDir,
  writeFile,
  global: global$1,
  readFile,
  performTask,
} = Native;

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

function now$1() {
  const time = new Date( Date.now() + GMT_PARALLAX );
  return {
    time,
    month: `${time.getUTCMonth() + 1}`,
    date: `${time.getUTCDate()}`,
  }; 
}

function isFirstWriteOfToday$1() {
  const lastWriteDate = global$1( GLOBAL_UPDATED_DATE );
  return lastWriteDate !== now$1().date;
}

function getStore( store ) {
  const stores = readFile( FILE_PATH )
    .split('\n')
    .map( r => r.split(';'))
    .map(([type, store, memo]) => new Data({type, store, memo}));
  return stores.find( s => s.get('store') === store );
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

const { exit, global } = Native;

 function main(sms, parser = ShinhanSOLPay) {
   const purchase = new Purchase(sms, parser);
   if (purchase.isNot) exit();

   createStoreFile();
   flushPreviousNotification();

   const storeData = getStore(purchase.data.get("store"));
   if (storeData) writePurchaseInfo(storeData, purchase);
   else {
     purchase.data.set("type", "기타");
     notifyNewStore(purchase.data);
   }
 }

 function createStoreFile() {
   if (!isDirExists(FILE_DIR)) createDirectory(FILE_DIR);
   writeTo(FILE_PATH, "");
 }

 function flushPreviousNotification() {
   const notifyInfo = global(GLOBAL_NOTIFY);
   if (notifyInfo) {
     const notifyData = Data.fromNotifyFormat(notifyInfo);
     writeSheet(notifyData);
   }
 }

 function writePurchaseInfo(storeData, purchase) {
   const data = new Data({
     price: purchase.data.get("price"),
     type: storeData.get("type"),
     memo: storeData.get("memo"),
   });

   notify({
     title: "메모 완료!",
     text: `${data.get("memo")}에서 ${data.get(
       "price"
     )}원을 결제하셨네요. 기록해둘게요!`,
   });
   writeSheet(data);
 }
