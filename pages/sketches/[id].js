import { hasUncaughtExceptionCaptureCallback } from 'process'
import { useEffect, useState } from 'react'
import { getAllSketchIds, getSketchData } from '../../lib/sketches'
import sketchStyles from '../../styles/sketch.module.scss'

import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { xonokai } from 'react-syntax-highlighter/dist/cjs/styles/prism';

export default function Post({ sketchData }) {
  const {
    title, code, codeFilename, contentHtml, hasReactComponent,
  } = sketchData

  // Dynamically import the component on mount. Including the component
  // in server-side generation would be ideal but I can't think of a clean
  // way to do that now.
  const [component, setComponent] = useState()
  if (hasReactComponent) {
    useEffect(
      () => {
        import(`../../sketches/code/${codeFilename}`)
          .then(c => setComponent(c.default))
          .catch(error => {
            console.error(`Error importing "${codeFilename}"`);
            console.error(error)
          });
      },
      []
    )
  }

  const languages = {
    'js': 'javascript',
    'jsx': 'javascript',
    'py': 'python',
  }
  const codeFilenameParts = codeFilename.split('.')
  const ext = codeFilenameParts[codeFilenameParts.length - 1]
  const language = languages[ext]
  console.log(language)

  return (
    <div>
      <h1>{title}</h1>
      <div
        className={sketchStyles.description}
        dangerouslySetInnerHTML={{ __html: contentHtml }} />
      {hasReactComponent &&
        <div className={sketchStyles.component}>
          {component}
        </div>}
      <h2>Code:</h2>
      <div className={sketchStyles.code}>
        <SyntaxHighlighter language={language} style={xonokai}>
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}

export async function getStaticPaths() {
  const paths = getAllSketchIds()
  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  const sketchData = await getSketchData(params.id)
  return {
    props: { sketchData }
  }
}
