let content = readFile('Tasker/Write_household_account_book/storeList')
let stores = content.split('\n')
msg = global('SMSRB').split( /\d\d:\d\d/gm )[1].trim()
var is_known = false
var type  = '기타'
var date  = '™'
var price = msg.match( /^(((\(금액\))|(KRW ))?(\d+(,|\.)?)+((원)|( 달러))?)/ )[0]
var store = msg.split( price )[1].trim()
price = parseNum( price )

for( let i=0; i < stores.length; i++ ) {
	let info = stores[i].split(';')
	if( msg.includes( info[1] )) {
		type     = info[0]
		store    = info.length < 3 ? info[1] : info[2]
		is_known = true
		break
	}
}

switch( price[1] ) {
	case '달러':
		price = parseInt( price[0] * 1200 )
		break
	default:
		price = price[0]
}


function parseNum( str ) {
	let r = 0
	let decimalPoint = 0
	let isDecimalPoint = false
	for( let i=0; i < str.length; i++ ) {
		if( str[i] >= '0' && str[i] <='9' ) {
			r = r * 10 + (str[i]-'0')
			if( isDecimalPoint ) {
				decimalPoint++
			}
		} else if( str[i] == '.' ) {
			isDecimalPoint = true
		}
	}
	for( let i=0; isDecimalPoint && i < decimalPoint; i++ ) {
		r *= 0.1
	}
	let currency = str.match( /([가-힣]+)$/ )
	if( currency == null ) {
		currency = ['원']
	}
	return [
		r, 
		currency[0]
	]
}