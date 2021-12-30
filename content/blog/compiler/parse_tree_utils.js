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

export function children(parseTreeNode) {
  switch (parseTreeNode.nodeType) {
    case "program": return parseTreeNode.classes
    case "class": return parseTreeNode.features
    case "attribute": return []
    case "method": return [parseTreeNode.body]
    case "identifier": return []
    case "expression": return []
    default: console.error("Unknown node type in children: " + parseTreeNode.nodeType)
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
