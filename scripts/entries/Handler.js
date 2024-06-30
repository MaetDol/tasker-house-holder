import { Data, Parser, Purchase, ShinhanSOLPay } from "../classes";
import { FILE_DIR, FILE_PATH, GLOBAL_NOTIFY } from "../constant";
import Native from "../native";
import {
  createDirectory,
  getStore,
  isDirExists,
  notify,
  notifyNewStore,
  writeSheet,
  writeTo,
} from "../util";
import "../main";

// Notification 이벤트의 Text 값
main(Native.local("evtprm3"), ShinhanSOLPay);

/**
 *
 * @param {string} sms
 * @param {typeof Parser} parser
 */
function main(sms, parser = ShinhanSOLPay) {
  const purchase = new Purchase(sms, parser);
  if (purchase.isNot) Native.exit();

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
  const notifyInfo = Native.global(GLOBAL_NOTIFY);
  if (notifyInfo) {
    const notifyData = Data.fromNotifyFormat(notifyInfo);
    writeSheet(notifyData);
  }
}

/**
 *
 * @param {Data} storeData
 * @param {Purchase} purchase
 */
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
