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
    let datePrefix = isFirstWriteOfDay() ? [[], now().date] : [''];
    return JSON.stringify([...datePrefix, '', price, type, memo]);
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

class Spreadsheet {

  constructor( sheet, auth ) {
    this.sheet = sheet;
    const a = auth.split(':');
    this.auth = { [a[0]]: a[1] };
    this.id = this.#id();
    this.baseUrl = this.#baseUrl();
  }

  #id() {
    const url = global( GLOBAL_SHEET_LINK );
    return url.match(/\/d\/(\w+)\/?/)?.[1];
  }

  #baseUrl() {
    return `https://sheets.googleapis.com/v4/spreadsheets/${this.id}`;
  }

  #valuesUrl( sheet, range ) {
    return `${this.baseUrl}/values/${sheet}!${range}?valueInputOption=RAW`;
  }

  #request( url, options ) {
  	flash('req')
  setClip(JSON.stringify(options))
    return fetch( url, options );
  }

  #lastRowIndex() {
    const url = this.#valuesUrl( this.sheet, 'C:C' );
    flash('lastRowIndex')
    return this.#request( url, {headers:this.auth, method:'put'} )
.then(r => {
	j = JSON.stringify(r);
    flash(j)
    setClip(j)
    return r;
})
.then( r => r.values.length ).catch(e=>flash('error'+e));
  }
  
  async append( data ) {
    const lastRow = await this.#lastRowIndex();
    flash('lastrow')
    const url = this.#valuesUrl( this.sheet, `A${lastRow+1}` );

    const options = {
      headers: this.auth,
      method: 'PUT',
      body: data.toSheetFormat(),
    };
let t = JSON.stringify({options, lastRow, url});
    flash(t)
    //setClip(t)
    flash('done')
return this.#request( url, options );
  }
}
