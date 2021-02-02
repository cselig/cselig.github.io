import React, { useState } from "react"
import { useStaticQuery, graphql } from "gatsby"

import FileNameCodeBlock from "./file_name_code_block.js"

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
  const fileName = filePath.split("/").pop()

  return (
    <div className={`expandable-code-block ${expanded ? "expanded" : ""}`}>
      <p className="button" onClick={() => setExpanded(!expanded)} aria-hidden="true">
        click for code
      </p>
      <FileNameCodeBlock code={node.fields.contents} fileName={fileName} />
    </div>
  )
}

export default ExpandableCodeBlock
