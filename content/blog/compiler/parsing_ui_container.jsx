import React from "react"
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
      data-id={node.id}>
      <p className="node-type">{node.nodeType}</p>
      {children}
    </div>
  )
}

function FunctionNode({ node, focusedNodeId }) {
  const focused = isChild(node, focusedNodeId)
  return (
    <div
      className={"parse-tree-node function " + (focused ? "focused" : "")}
      data-id={node.id}
    >
      <p className="node-type">{node.nodeType}</p>
      <p>{`Function name: ${node.fid}`}</p>
      <p>Function body:</p>
      <ExpressionNode node={node.body} focusedNodeId={focusedNodeId} />
    </div>
  )
}

function ExpressionNode({ node, focusedNodeId }) {
  let Type
  switch (node.expressionType) {
    case "invocation": Type = InvocationExpressionNode; break;
    case "if": Type = IfExpressionNode; break;
    case "+": Type = AdditionExpressionNode; break;
    case "-": Type = SubtractionExpressionNode; break;
    case "vid": Type = VidExpressionNode; break;
    case "literal": Type = LiteralExpressionNode; break;
    default: Type = UnknownExpressionNode;
  }
  return <Type node={node} focusedNodeId={focusedNodeId} />
}

function UnknownExpressionNode({ node, focusedNodeId }) {
  const focused = isChild(node, focusedNodeId)
  return (
    <div
      className={"parse-tree-node expression " + (focused ? "focused" : "")}
      data-id={node.id}>
      <p style={{color: 'red'}}>Unknown</p>
      <p className="node-type">expression</p>
      <p>{`Expression type: ${node.expressionType}`}</p>
    </div>
  )
}

function InvocationExpressionNode({ node, focusedNodeId }) {
  const args = node.args.map((arg) => (
    <ExpressionNode node={arg} focusedNodeId={focusedNodeId} key={arg.id} />
  ))

  const focused = isChild(node, focusedNodeId)
  return (
    <div
      className={"parse-tree-node expression " + (focused ? "focused" : "")}
      data-id={node.id}>
      <p className="node-type">Function Invocation</p>
      <p>{`Invoked function: ${node.fid}`}</p>
      <p>Arguments:</p>
      {args}
    </div>
  )
}

function IfExpressionNode({ node, focusedNodeId }) {
  const focused = isChild(node, focusedNodeId)
  return (
    <div
      className={"parse-tree-node expression " + (focused ? "focused" : "")}
      data-id={node.id}>
      <p className="node-type">If-then-else</p>
      <p>Predicate LHS:</p>
      <ExpressionNode node={node.predicateLHS} focusedNodeId={focusedNodeId} />
      <p>Predicate RHS:</p>
      <ExpressionNode node={node.predicateRHS} focusedNodeId={focusedNodeId} />
      <p>True branch:</p>
      <ExpressionNode node={node.trueBranch} focusedNodeId={focusedNodeId} />
      <p>False branch:</p>
      <ExpressionNode node={node.falseBranch} focusedNodeId={focusedNodeId} />
    </div>
  )
}

function AdditionExpressionNode({ node, focusedNodeId }) {
  const focused = isChild(node, focusedNodeId)
  return (
    <div
      className={"parse-tree-node expression " + (focused ? "focused" : "")}
      data-id={node.id}>
      <p className="node-type">Addition</p>
      <p>LHS:</p>
      <ExpressionNode node={node.lhs} focusedNodeId={focusedNodeId} />
      <p>RHS:</p>
      <ExpressionNode node={node.rhs} focusedNodeId={focusedNodeId} />
    </div>
  )
}

function SubtractionExpressionNode({ node, focusedNodeId }) {
  const focused = isChild(node, focusedNodeId)
  return (
    <div
      className={"parse-tree-node expression " + (focused ? "focused" : "")}
      data-id={node.id}>
      <p className="node-type">Subtraction</p>
      <p>LHS:</p>
      <ExpressionNode node={node.lhs} focusedNodeId={focusedNodeId} />
      <p>RHS:</p>
      <ExpressionNode node={node.rhs} focusedNodeId={focusedNodeId} />
    </div>
  )
}

function VidExpressionNode({ node, focusedNodeId }) {
  const focused = isChild(node, focusedNodeId)
  return (
    <div
      className={"parse-tree-node expression " + (focused ? "focused" : "")}
      data-id={node.id}>
      <p className="node-type">Variable reference</p>
      <p>{`Variable name: ${node.value}`}</p>
    </div>
  )
}

function LiteralExpressionNode({ node, focusedNodeId }) {
  const focused = isChild(node, focusedNodeId)
  return (
    <div
      className={"parse-tree-node expression " + (focused ? "focused" : "")}
      data-id={node.id}>
      <p className="node-type">Literal</p>
      <p>{`Value: ${node.value}`}</p>
    </div>
  )
}

export default function ParsingUIContainer({ parseTree, focusedNodeId, setFocusedNodeId }) {
  const onMouseOver = (e) => {
    if (!e.target.classList.contains("parse-tree-node")) return
    const nodeId = e.target.getAttribute("data-id")
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
