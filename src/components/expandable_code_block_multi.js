import React, { useState } from "react"
import { useStaticQuery, graphql } from "gatsby"

import FileNameCodeBlock from "./file_name_code_block.js"

import "../css/expandable_code_block.scss"

const ExpandableCodeBlockMulti = ({ filePaths }) => {
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
  const nodes = data.allFile.nodes.filter((node) => filePaths.includes(node.relativePath))
  if (nodes.length !== filePaths.length) {
    console.warn("Trouble locating file(s).")
  }

  return (
    <div className={`expandable-code-block ${expanded ? "expanded" : ""}`}>
      <p className="button" onClick={() => setExpanded(!expanded)} aria-hidden="true">
        click for code
      </p>
      {nodes.map((node) => {
        const fileName = node.relativePath.split("/").pop()
        return <FileNameCodeBlock code={node.fields.contents} fileName={fileName} key={node.relativePath} />
      })}
    </div>
  )
}

export default ExpandableCodeBlockMulti
