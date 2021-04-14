function main( sms ) {
  // 결제 확인 문자인지 확인
  const purchase = new Purchase( sms, ShinhanCheckParser );
  if( purchase.isNot ) exit();

  createStoreFile();
  flushPreviousNotification();

  const storeData = getStore( purchase.data.get('store') );
  if( storeData ) writePurchaseInfo( storeData );
  else {
    purchase.data.set('type', '기타');
    notifyNewStore( purchase.data );
  }
}

function createStoreFile() {
  // 가게 정보를 담는 파일의 상위경로가 없다면 생성
  if( !isDirExists( FILE_DIR ) ) createDirectory( FILE_DIR );
  // 파일이 존재하는지 확인하는 것 보단 작성하는게 더 저렴할 지도 모른다
  writeTo( FILE_PATH, '' );
}

function flushPreviousNotification() {
  // 알림이 띄워진 상태면 시트에 그대로 작성
  const notifyInfo = global( GLOBAL_NOTIFY );
  if( notifyInfo ) {
    const notifyData = Data.fromNotifyFormat( notifyInfo );
    writeSheet( notifyData );
  }
}

function writePurchaseInfo( data ) {
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
