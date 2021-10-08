import './style.css'
import Split from 'split-grid'
import { decode, encode } from 'js-base64'
import * as monaco from 'monaco-editor'
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'


window.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === 'html') {
      return new HtmlWorker()
    }
  }
}



const getElem = selector => document.querySelector(selector);


const { pathname } = window.location
const $html = getElem('#html');
const $js = getElem('#js');
const $css = getElem('#css');
const $iframe = getElem('#iframe');

const [htmlRaw, cssRaw, jsRaw] = pathname.slice(1).split('&')
const html = decode(htmlRaw);
const css = decode(cssRaw);
const js = decode(jsRaw);

const htmlEditor = monaco.editor.create($html, {
  value: html,
  fontSize: '18',
  language: 'html',
  theme: 'vs-dark'
})

const htmlForPreview = createHTML({html, css, js});
$iframe.setAttribute('srcdoc', htmlForPreview)

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

const update = () => {
  const html = htmlEditor.getValue()
  const js = $js.value;
  const css = $css.value;
  const hashCode = `${encode(html)}&${encode(css)}&${encode(js)}`
  const htmlForPreview = createHTML({html, css, js});

  window.history.replaceState(null, null, `/${hashCode}`)
  $iframe.setAttribute('srcdoc', htmlForPreview)
}

function createHTML({html, css, js}) {
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

//$html.addEventListener('input', udpate)
htmlEditor.onDidChangeModelContent(update)
$css.addEventListener('input', update)
$js.addEventListener('input', update)