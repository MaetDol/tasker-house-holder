class Purchase {
  constructor( msg, parserCls ) {
    this.parser = new parserCls( msg );
    this._isNot = true;
    if( this.parser.failed ) {
      this._isNot = true;
      return;
    }
  }
  get info() { return this.parser.parsedData; }
  get isNot() { return this._isNot; }
}