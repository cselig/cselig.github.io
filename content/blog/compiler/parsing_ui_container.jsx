import React, { useState } from "react"
import { isChild } from './parse_tree_utils'

function ProgramNode({ node, focusedNodeId }) {
  const children = node.functions.map((n, i) => (
    <FunctionNode
      node={n}
      focusedNodeId={focusedNodeId}
      key={i} />
  ))
  const focused = isChild(node, focusedNodeId)
  return (
    <div
      className={"parse-tree-node program " + (focused ? "focused" : "")}
      id={node.id}>
      <p className="node-type">{node.nodeType}</p>
      {children}
    </div>
  )
}

function FunctionNode({ node, focusedNodeId }) {
  const children = node.body.map((n, i) => (
    <ExpressionNode
      node={n}
      focusedNodeId={focusedNodeId}
      key={i} />
  ))
  const focused = isChild(node, focusedNodeId)
  return (
    <div
      className={"parse-tree-node function " + (focused ? "focused" : "")}
      id={node.id}
    >
      <p className="node-type">{node.nodeType}</p>
      <p>{`Function name: ${node.fid}`}</p>
      {children}
    </div>
  )
}

function ExpressionNode({ node, focusedNodeId }) {
  const focused = isChild(node, focusedNodeId)
  return (
    <div
      className={"parse-tree-node expression " + (focused ? "focused" : "")}
      id={node.id}>
      <p className="node-type">expression</p>
      <p>{`Expression type: ${node.expressionType}`}</p>
    </div>
  )
}

export default function ParsingUIContainer({ parseTree }) {
  const [focusedNodeId, setFocusedNodeId] = useState(null)

  const onMouseOver = (e) => {
    if (!e.target.classList.contains("parse-tree-node")) return
    const nodeId = e.target.getAttribute("id")
    setFocusedNodeId(nodeId)
  }
  const onMouseOut = (e) => {
    // unset if we've moused out of the tree UI
    if (e.target.id === "parsing-ui-container") {
      setFocusedNodeId(null)
    }
  }

  return (
    <div
      id="parsing-ui-container"
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
    >
      <h2>Parse Tree:</h2>
      {parseTree &&
        parseTree.error ?
          <div className="parse-error">
            <pre>{parseTree.error}</pre>
          </div>
          :
          <ProgramNode node={parseTree} focusedNodeId={focusedNodeId} />}
    </div>
  )
}
