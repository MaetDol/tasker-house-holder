
// 결제 확인 문자인지 확인
const sms = global('SMSRB');
const purchase = new Purchase( sms, ShinhanCheckParser );
if( purchase.isNot ) exit();

// 가게 정보를 담는 파일의 상위경로가 없다면 생성
if( !isDirExists( FILE_DIR ) ) createDirectory( FILE_DIR );

// 알림이 띄워진 상태면 시트에 그대로 작성
const notifyInfo = global( GLOBAL_NOTIFY );
if( notifyInfo ) {
  setGlobal( GLOBAL_NOTIFY, '' );
  clearNotify( NOTIFY_TITLE );
  const notifyData = Data.fromNotifyFormat( notifyInfo );
  writeSheet( notifyData );
}

// 가게 정보가 있다면 해당 정보로 시트 작성
const store = getStore( purchase.data.get('store') );
if( store ) {
  const price = purchase.data.get('price');
  const memo = store.memo || store.store;
  const data = new Data({ 
    price,
    type: store.type,
    memo
  });
  writeSheet( data.toSheetFormat() );

  notify({
    title: '메모 완료!',
    text: `${memo}에서 ${price}원을 결제하셨네요. 메모 해두겠습니다.`
  });
} else {
  purchase.data.set('type', '기타');
  notifyNewStore( purchase.data.toNotifyFormat() );
}
