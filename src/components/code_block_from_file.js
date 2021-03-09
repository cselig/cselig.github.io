import React from 'react'
import { useStaticQuery, graphql } from "gatsby"

import CodeBlock from './code_block'

function CodeBlockFromFile({ filePath }) {
  const data = useStaticQuery(graphql`
    query {
      allFile {
        nodes {
          fields {
            contents
          }
          relativePath
        }
      }
    }
  `)

  // we only need one file, but non-page queries cannot take parameters
  // https://github.com/gatsbyjs/gatsby/issues/9047
  const nodes = data.allFile.nodes.filter((node) => filePath === node.relativePath)
  if (nodes.length !== 1) {
    console.warn("Trouble locating file.")
  }
  const node = nodes[0]

  const ext = node.relativePath.split(".").pop()

  return <CodeBlock code={node.fields.contents} language={ext} />
}

export default CodeBlockFromFile
