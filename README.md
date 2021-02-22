# Tasker로 만든 가계부
Tasker 의 Task와 HTML form, JS로 만든 가계부입니다. \
기본적인 흐름은 아래의 flowchart와 같이 이루어집니다. \
![flowchart image](https://github.com/MaetDol/tasker-house-holder/blob/master/flowchart.png)

## 사용하기 전 준비
우선, Tasker를 사용하니 Tasker 앱이 필요합니다. 안드로이드 버전만 있으며, 유료입니다. \
1. 해당 레포를 .zip으로 받거나 clone으로 받아서 Tasker group<여기에 해당 사진>에서 임포트 한 후
2. `🏡 Auth` Task를 하나 만든 다음, 아래의 링크를 참조해 구글 개발자 콘솔에 가입한 다음 \
2-1. Sheet API 권한을 받고 Client 키, Client Secret을 등록해 HTTP-Auth 액션에 값을 넣습니다. \
2-2. <개발자 등록 및 Auth Task 만드는 설명 보충 필요>
3. 구글 시트 링크를 복사해 `🏡 Initial global var`의 `Sheet url`로 라벨링 된 액션을 수정합니다. \
4. `🏡 Initial global var`를 실행해 `(1)`의 zip 폴더로 설정합니다.


## Ref

- [Tasker JS document](https://tasker.joaoapps.com/userguide/en/javascript.html)
- [Use google spreadsheet without plugin](https://forum.joaoapps.com/index.php?resources/add-a-row-of-data-to-a-google-spreadsheet-no-plugins.383/)
