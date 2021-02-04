if( document.readyState === 'loading' ){
  window.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

function $(s) {
  return document.querySelectorAll(s);
}

function init(){
  setLocal('type', '기타');
  setLocal('memo', local('store'));
  $('[name="memo"], [name="store"]').forEach( el => {
    el.value = local('store');
  });

  $('[autofocus]')[0].focus();

  $('input').forEach( el => {
    el.oninput = _=> setLocal( el.name, el.value );
  });

  const sceneName = $('body')[0].dataset.sceneName;
  $('button')[0].onclick = _ => destroyScene( sceneName );
}
