var todayDate = new Date().getUTCDate() + ''
var updatedDate = global('UHAB_updatedDate')
flash(`${todayDate}, ${updatedDate}`);
if( updatedDate == null || updatedDate != todayDate ) {
	setGlobal( 'UHAB_updatedDate', todayDate )
	todayDate = `¶™¶${todayDate}™`;
} else {
	todayDate = '™'
}
var purchase_data = `${todayDate}™${param}`;