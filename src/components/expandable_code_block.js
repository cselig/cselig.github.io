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

  return (
    <div className={`expandable-code-block ${expanded ? "expanded" : ""}`}>
      <p className="button" onClick={() => setExpanded(!expanded)}>
        click for code
      </p>
      <CodeBlock children={node.fields.contents} />
    </div>
  )
}

export default ExpandableCodeBlock