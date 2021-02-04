if( document.readyState === 'loading' ){
  window.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

const $ = s => document.querySelectorAll(s);

function init(){
  $('input').forEach( el => {
    el.oninput = _=> setLocal( el.name, el.value );
  });

  const sceneName = $('body')[0].dataset.sceneName;
  $('button')[0].onclick = _ => destroyScene( sceneName );
}
