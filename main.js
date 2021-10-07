import './style.css'
import Split from 'split-grid'
import { decode, encode } from 'js-base64'

const getElem = selector => document.querySelector(selector);

const $html = getElem('#html');
const $js = getElem('#js');
const $css = getElem('#css');
const $iframe = getElem('#iframe');

Split({
  columnGutters: [{
    track: 1,
    element: getElem('.vertical-gutter'),
  }],
  rowGutters: [{
    track: 1,
    element: getElem('.horizontal-gutter'),
  }]
})

const init = () => {
  const {pathname} = window.location
  const [html, css, js] = pathname.slice(1).split('&')

  if (html | css | js) {
    $html.value = decode(html);
    $css.value = decode(css);
    $js.value = decode(js);
  
    const htmlForPreview = createHTML();
    $iframe.setAttribute('srcdoc', htmlForPreview)
  }
  
}

const udpate = () => {
  const html = $html.value;
  const js = $js.value;
  const css = $css.value;
  const hashCode = `${encode(html)}&${encode(css)}&${encode(js)}`
  const htmlForPreview = createHTML();

  window.history.replaceState(null, null, `/${hashCode}`)
  $iframe.setAttribute('srcdoc', htmlForPreview)
}

const createHTML = () => {

  const html = $html.value;
  const css = $css.value;
  const js = $js.value;

  return `
  <!DOCTYPE html>
  <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <style>
      *{
        box-sizing: border-box;
      }
      
      *::before, *::after {
        box-sizing: inherit;
      }
      
      body {
        background-color: #f1f1f1;
        color: #333;
        font-family: 'Helvetica Neue', Arial, Helvetica, sans-serif;
        font-size: 16px;
        line-height: 1.4;
        margin: 0;
        padding: 0;
        height: 100vh;
        width: 100vw;
      }
       ${css}
      </style>
    </head>
    <body>
      ${html}
      <script>
      ${js}
      </script>
    </body>
  </html>
  `
}

init()

$html.addEventListener('input', udpate)
$css.addEventListener('input', udpate)
$js.addEventListener('input', udpate)