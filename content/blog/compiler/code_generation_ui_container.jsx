import React from "react"

import { isChild } from "./parse_tree_utils"
import generateCode from "./calculator_code_generation"

export default function CodeGenerationUIContainer({ parseTree, focusedNodeId }) {
  const code = generateCode(parseTree)
  return (
    <div id="code-generation-ui-container">
      <h2>Generated Machine Code</h2>
      <pre>
        {code.map(([line, node], i) => {
          const className = isChild(node, focusedNodeId) ? "focused" : ""
          return <span className={className} key={i}>{line + "\n"}</span>
        })}
      </pre>
    </div>
  )
}
