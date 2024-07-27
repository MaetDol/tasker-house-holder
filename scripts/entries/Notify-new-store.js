import { Data } from '../classes';
import { GLOBAL_NOTIFY } from '../constant';
import Native from '../native';
import '../main';
import { log } from '../util';

try {
	main();
} catch (e) {
	log(`Notify-new-store.js: ${e}`);
}

function main() {
	const notifyFormattedData = Native.local('par1');
	Native.setGlobal(GLOBAL_NOTIFY, notifyFormattedData);

	const data = Data.fromNotifyFormat(notifyFormattedData);
	data.set(Data.Props.MEMO, data.get(Data.Props.STORE));
	data.toLocal();

	Native.setLocal('sheet_format', data.toSheetFormat());
}
