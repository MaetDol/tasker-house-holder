const GMT_PARALLAX = 9 * 60*60*1000;
var todayDate = new Date( new Date() + GMT_PARALLAX )
	.getUTCDate()
	.toString();
var updatedDate = global('UHAB_updatedDate');
flash(`${todayDate}, ${updatedDate}`);
if( updatedDate !== todayDate ) {
	setGlobal( 'UHAB_updatedDate', todayDate )
	todayDate = `¶™¶${todayDate}™`;
} else {
	todayDate = '™'
}
var purchase_data = `${todayDate}™${param}`;