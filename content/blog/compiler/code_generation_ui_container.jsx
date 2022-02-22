import React from "react"

import { isAncestor } from "./parse_tree_utils"
import generateCode from "./calculator_code_generation"

export default function CodeGenerationUIContainer({ parseTree, focusedNodeId, setFocusedNodeId }) {
  if (parseTree.error) {
    return <></>
  }
  const code = generateCode(parseTree)
  return (
    <div
      id="code-generation-ui-container"
      className={(focusedNodeId === null ? "" : "focused")}>
      <h2>Generated Machine Code</h2>
      <pre>
        {code.map(([line, node], i) => {
          const className =
            (isAncestor(node, focusedNodeId) ? "focused " : "") +
            (line.startsWith("label:") ? "label " : "")
          return (
            <span
              className={className}
              onMouseOver={() => setFocusedNodeId(node.id)}
              onMouseOut={() => setFocusedNodeId(null)}
              key={i}>
                {line + "\n"}
            </span>
          )
        })}
      </pre>
    </div>
  )
}
