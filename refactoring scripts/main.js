
// 결제 확인 문자인지 확인
const sms = global('SMSRB');
if( !/신한체크(해외)?승인/.test( sms ) ) return;

// 가게 정보를 담는 파일이 없으면 생성
if( !isStoreFileExists() ) createStoreFile();

// 알림이 띄워진 상태면 시트에 그대로 작성
if( onNotify() ) {
  writeSheet();
}

// 가게 정보가 있다면 해당 정보로 시트 작성
const store = getStore();
if( store ) {
  writeSheet();
}

// 없다면 알림으로 띄우기
notify();