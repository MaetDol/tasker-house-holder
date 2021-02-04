const $ = s => document.querySelectorAll(s);

document.addEventListener('DOMContentLoaded', _ => {

  $('input').forEach( el => {
    el.oninput = _=> setLocal( el.name, el.value );
  });

  const sceneName = $('body')[0].dataset.sceneName;
  $('button')[0].onclick = _ => destroyScene( sceneName );
});
