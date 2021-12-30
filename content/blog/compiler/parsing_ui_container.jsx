import React, { useState } from "react"
import { isChild } from './parse_tree_utils'

function ProgramNode({ node, focusedNodeId }) {
  const children = node.classes.map((classNode, i) => (
    <ClassNode
      node={classNode}
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

function ClassNode({ node, focusedNodeId }) {
  const features = node.features.map((featureNode, i) => {
    if (featureNode.nodeType == "attribute") {
      return <AttributeNode
               node={featureNode}
               focusedNodeId={focusedNodeId}
               key={i} />
    } else {
      return <MethodNode
               node={featureNode}
               focusedNodeId={focusedNodeId}
               key={i} />
    }
  })
  const focused = isChild(node, focusedNodeId)
  return (
    <div
      className={"parse-tree-node class " + (focused ? "focused" : "")} id={node.id}>
      <p className="node-type">{node.nodeType}</p>
      <p>Class name: {node.className}</p>
      {node.classParent != undefined &&
        <p>Inherits from: {node.classParent}</p>
      }
      {features}
    </div>
  )
}

function AttributeNode({ node, focusedNodeId }) {
  const focused = isChild(node, focusedNodeId)
  return (
    <div
      className={"parse-tree-node attribute " + (focused ? "focused" : "")}
      id={node.id}>
      <p className="node-type">attribute</p>
      <p>Identifier: {node.name}</p>
      <p>Type: {node.type}</p>
    </div>
  )
}

function MethodNode({ node, focusedNodeId }) {
  const params = node.params.map((param, i) => (
    <p key={i}>Name: {param.name}, type: {param.type}</p>
  ))
  const focused = isChild(node, focusedNodeId)
  return (
    <div
      className={"parse-tree-node method " + (focused ? "focused" : "")}
      id={node.id}>
      <p className="node-type">method</p>
      <p>Identifier: {node.name}</p>
      {params.length === 0 ?
        <p>No parameters</p>
        :
        <>
          <p>Parameters:</p>
          {params}
        </>
      }
      <ExpressionNode node={node.body} focusedNodeId={focusedNodeId} />
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
