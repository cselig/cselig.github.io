import React, { useState } from "react"
import { useStaticQuery, graphql } from "gatsby"

import CodeBlock from "./code_block"

import "../css/expandable_code_block.scss"

const ExpandableCodeBlock = ({ filePath }) => {
  const [expanded, setExpanded] = useState(false)

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
  const nodes = data.allFile.nodes.filter((node) => node.relativePath === filePath)
  if (nodes.length !== 1) {
    console.warn("Trouble locating file:", filePath)
  }
  const node = nodes[0]
  const ext = filePath.split(".").pop()

  return (
    <div className={`expandable-code-block ${expanded ? "expanded" : ""}`}>
      <p className="button" onClick={() => setExpanded(!expanded)} aria-hidden="true">
        click for code
      </p>
      <CodeBlock code={node.fields.contents} language={ext} />
    </div>
  )
}

export default ExpandableCodeBlock
