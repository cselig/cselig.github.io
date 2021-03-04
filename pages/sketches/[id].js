import { getAllSketchIds, getSketchData } from '../../lib/sketches'
import styles from '../../styles/sketch.module.scss'
import Layout from '../../components/layout'

import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { xonokai } from 'react-syntax-highlighter/dist/cjs/styles/prism';

import ChordData from '../../sketches/code/chord_data'
import Pipes from '../../sketches/code/pipes'
import SkiGraph from '../../sketches/code/ski_graph'

// Doing this so components will be included in the server side render and won't
// pop in after the page loads.
const COMPONENTS = {
  'chord_data.jsx': <ChordData/>,
  'pipes.jsx': <Pipes/>,
  'ski_graph.jsx': <SkiGraph/>,
}

export default function Post({ sketchData }) {
  const {
    title, code, codeFilename, contentHtml, hasReactComponent,
  } = sketchData

  const component = COMPONENTS[codeFilename]

  const languages = {
    'js': 'javascript',
    'jsx': 'javascript',
    'py': 'python',
  }
  const codeFilenameParts = codeFilename.split('.')
  const ext = codeFilenameParts[codeFilenameParts.length - 1]
  const language = languages[ext]

  return (
    <Layout>
      <h1 className={styles.title}>{title}</h1>
      <div
        dangerouslySetInnerHTML={{ __html: contentHtml }} />
      {hasReactComponent &&
        <div>
          {component}
        </div>}
      <h2>Code:</h2>
      <div>
        <SyntaxHighlighter language={language} style={xonokai}>
          {code}
        </SyntaxHighlighter>
      </div>
    </Layout>
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
