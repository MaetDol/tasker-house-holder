import {
	Data,
	Purchase,
	ShinhanCheckParser,
	ShinhanMsgParser,
	ShinhanSOLPay,
} from '../classes';
import { FILE_DIR, FILE_PATH, GLOBAL_NOTIFY } from '../constant';
import '../main';
import Native from '../native';
import {
	createDirectory,
	getStore,
	isDirExists,
	log,
	notify,
	notifyNewStore,
	writeSheet,
	writeTo,
} from '../util';
import { delay } from '../utils/delay';

try {
	// Notification 이벤트의 Text 값
	const smsText = Native.local('evtprm3');

	[ShinhanCheckParser, ShinhanMsgParser, ShinhanSOLPay].some((parser) => {
		const purchase = new Purchase(smsText, parser);
		if (purchase.isNot) return false;

		main(purchase);
		return true;
	});
} catch (e) {
	log(`Handler.js: ${e}`);
}

/**
 *
 * @param {Purchase} purchase
 */
async function main(purchase) {
	createStoreFile();
	await flushPreviousNotification();

	const storeData = getStore(purchase.data.get('store'));
	if (storeData) writePurchaseInfo(storeData, purchase);
	else {
		purchase.data.set('type', '기타');
		notifyNewStore(purchase.data);
	}
}

function createStoreFile() {
	if (!isDirExists(FILE_DIR)) createDirectory(FILE_DIR);
	writeTo(FILE_PATH, '');
}

async function flushPreviousNotification() {
	const notifyInfo = Native.global(GLOBAL_NOTIFY);
	if (notifyInfo) {
		const notifyData = Data.fromNotifyFormat(notifyInfo);
		writeSheet(notifyData);
    await delay(2000)
	}
}

/**
 *
 * @param {Data} storeData
 * @param {Purchase} purchase
 */
function writePurchaseInfo(storeData, purchase) {
	const data = new Data({
		price: purchase.data.get('price'),
		type: storeData.get('type'),
		memo: storeData.get('memo'),
	});

	notify({
		title: '메모 완료!',
		text: `${data.get('memo')}에서 ${data.get(
			'price',
		)}원을 결제하셨네요. 기록해둘게요!`,
	});
	writeSheet(data);
}
