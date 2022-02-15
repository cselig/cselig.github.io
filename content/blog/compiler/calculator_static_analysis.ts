import { children } from "./parse_tree_utils"

export function checkMainExists(parseTree) {
  for (const node of parseTree.functions) {
    if (node.fid === 'Main') {
      if (node.params.length > 0) {
        return "`Main` function must take no params."
      } else {
        return ''
      }
    }
  }
  return "Function `Main` must be defined"
}

export function checkFunctionsInvokedProperly(parseTreeRoot) {
  const error = checkFunctionsInvokedProperlyHelper(parseTreeRoot, parseTreeRoot)
  // check for node, then for all children
  console.log("error:", error)
  return error || ""
}

function checkFunctionsInvokedProperlyHelper(node, root) {
  console.log("checkFunctionsInvokedProperlyHelper")
  if (node.nodeType === 'expression' && node.expressionType === 'invocation') {
    const expectedParams = getFunctionParams(root, node.fid)
    console.log("->>>>", expectedParams, node.args)
    if (expectedParams.length !== node.args.length) {
      const error = `Problem with invocation of function ${node.fid}`
      console.error(error)
      return error
    }
  }

  for (const child of children(node)) {
    const error = checkFunctionsInvokedProperlyHelper(child, root)
    if (error != undefined) return error
  }
}

function getFunctionParams(parseTreeRoot, fid) {
  for (const node of parseTreeRoot.functions) {
    if (node.fid === fid) {
      return node.params
    }
  }
}