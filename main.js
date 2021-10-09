import './style.css'
import Split from 'split-grid'
import { decode, encode } from 'js-base64'
import * as monaco from 'monaco-editor'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'


window.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === 'html') return new HtmlWorker();
    if (label === 'css') return new CssWorker();
    if (label === 'javascript') return new TsWorker();
    return new EditorWorker()
  }
}

const COMMON_EDITOR_OPTIONS = {
  fontSize: '18',
  theme: 'vs-dark',
  automaticLayout: true
}

const getElem = selector => document.querySelector(selector);
const $html = getElem('#html');
const $js = getElem('#js');
const $css = getElem('#css');
const $iframe = getElem('#iframe');

const { pathname } = window.location
const [htmlRaw, cssRaw, jsRaw] = pathname.slice(1).split('&')

const html = htmlRaw ? decode(htmlRaw) : '';
const css = cssRaw ? decode(cssRaw) : '';
const js = jsRaw ? decode(jsRaw) : '';

const htmlEditor = monaco.editor.create($html, {
  value: html,
  language: 'html',
  ...COMMON_EDITOR_OPTIONS
})
const cssEditor = monaco.editor.create($css, {
  value: css,
  language: 'css',
  ...COMMON_EDITOR_OPTIONS
})
const tsEditor = monaco.editor.create($js, {
  value: js,
  language: 'javascript',
  ...COMMON_EDITOR_OPTIONS
})

const htmlForPreview = createHTML({ html, css, js });
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
  const js = tsEditor.getValue()
  const css = cssEditor.getValue();
  const hashCode = `${encode(html)}&${encode(css)}&${encode(js)}`
  const htmlForPreview = createHTML({ html, css, js });

  window.history.replaceState(null, null, `/${hashCode}`)
  $iframe.setAttribute('srcdoc', htmlForPreview)
}

function createHTML({ html, css, js }) {
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

// $html.addEventListener('input', udpate)
// $css.addEventListener('input', update)
// $js.addEventListener('input', update)
htmlEditor.onDidChangeModelContent(update)
cssEditor.onDidChangeModelContent(update)
tsEditor.onDidChangeModelContent(update)