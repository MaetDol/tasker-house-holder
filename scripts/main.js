function main( sms ) {
  const purchase = new Purchase( sms, ShinhanCheckParser );
  if( purchase.isNot ) exit();

  createStoreFile();
  flushPreviousNotification();

  const storeData = getStore( purchase.data.get('store') );
  if( storeData ) writePurchaseInfo( storeData, purchase );
  else {
    purchase.data.set('type', '기타');
    notifyNewStore( purchase.data );
  }
}

function createStoreFile() {
  if( !isDirExists( FILE_DIR ) ) createDirectory( FILE_DIR );
  writeTo( FILE_PATH, '' );
}

function flushPreviousNotification() {
  const notifyInfo = global( GLOBAL_NOTIFY );
  if( notifyInfo ) {
    const notifyData = Data.fromNotifyFormat( notifyInfo );
    writeSheet( notifyData );
  }
}

function writePurchaseInfo( storeData, purchase ) {
  const data = new Data({ 
    price: purchase.data.get('price'),
    type: storeData.get('type'),
    memo: storeData.get('memo'),
  });

  notify({
    title: '메모 완료!',
    text: `${data.get('memo')}에서 ${data.get('price')}원을 결제하셨네요. 기록해둘게요!`
  });
  writeSheet( data );
}
