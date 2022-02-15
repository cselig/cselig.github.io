import { v4 as uuidv4 } from 'uuid';

// Returns true if parentNodeId == node.id
export function isChild(node, parentNodeId) {
  if (parentNodeId === node.id) return true
  while (node.parent) {
    if (parentNodeId === node.id) return true
    node = node.parent
  }
  return false
}

function expressionChildren(parseTreeNode) {
  switch (parseTreeNode.expressionType) {
    case "invocation": return parseTreeNode.args
    case "if": return [
      parseTreeNode.predicateLHS,
      parseTreeNode.predicateRHS,
      parseTreeNode.trueBranch,
      parseTreeNode.falseBranch,
    ]
    case "+":
    case "-":
      return [parseTreeNode.lhs, parseTreeNode.rhs]
    case "vid":
    case "literal":
      return []
    default:
      console.error(`Unknown expression type: ${parseTreeNode.expressionType}`)
      return []
  }
}

export function children(parseTreeNode) {
  switch (parseTreeNode.nodeType) {
    case "program": return parseTreeNode.functions
    case "function": return [parseTreeNode.body]
    case "expression": return expressionChildren(parseTreeNode)
    default:
      console.error("Unknown node type in children: " + parseTreeNode.nodeType)
      return []
  }
}

export function addIds(parseTreeNode) {
  parseTreeNode.id = uuidv4()
  for (const child of children(parseTreeNode)) {
    addIds(child)
  }
}

export function doublyLinkTree(parseTreeNode) {
  for (const child of children(parseTreeNode)) {
    child.parent = parseTreeNode
    doublyLinkTree(child)
  }
}
