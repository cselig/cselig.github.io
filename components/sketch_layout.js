import Layout from './layout'
import { MDXProvider } from '@mdx-js/react'

import CodeBlock from './code_block'

const H1 = props => <h1 style={{textAlign: "center"}} {...props} />

const components = {
  h1: H1,
  pre: CodeBlock,
}

export default function SketchLayout({ children }) {
  return (
    <MDXProvider components={components}>
      <Layout>
        {children}
      </Layout>
      {/* TODO: figure out how to put code string here */}
    </MDXProvider>
  )
}
