import { children } from "./parse_tree_utils"

type StaticAnalysisError = [string, string]

export function checkFunctionNamesUnique(parseTree): StaticAnalysisError {
  let fNames = new Set()
  for (const { fid, id } of parseTree.functions) {
    if (fNames.has(fid)) {
      return [`Function ${fid} redefined`, id]
    } else {
      fNames.add(fid)
    }
  }
  return ["", null]
}

export function checkMainExists(parseTree): StaticAnalysisError {
  for (const node of parseTree.functions) {
    if (node.fid === 'Main') {
      if (node.params.length > 0) {
        return ["`Main` function must take no params.", node.id]
      } else {
        return ['', null]
      }
    }
  }
  return ["Function `Main` must be defined", null]
}

export function checkFunctionsInvokedProperly(parseTreeRoot): StaticAnalysisError {
  function helper(node, root) {
    if (node.nodeType === 'expression' && node.expressionType === 'invocation') {
      const nExpected = getFunctionParams(root, node.fid).length
      const nActual = node.args.length
      if (nExpected !== nActual) {
        const error = `Function ${node.fid} called with wrong number of arguments (expected ${nExpected}, got ${nActual})`
        return [error, node.id]
      }
    }

    for (const child of children(node)) {
      const error = helper(child, root)
      if (error != undefined) return error
    }
  }

  return helper(parseTreeRoot, parseTreeRoot) || ["", null]
}

function getFunctionParams(parseTreeRoot, fid) {
  for (const node of parseTreeRoot.functions) {
    if (node.fid === fid) {
      return node.params
    }
  }
}

export function checkDuplicateParams(parseTree): StaticAnalysisError {
  for (const { fid, params, id } of parseTree.functions) {
    let seen = new Set()
    for (const p of params) {
      if (seen.has(p)) {
        return [`Function ${fid} has duplicate param ${p}`, id]
      } else {
        seen.add(p)
      }
    }
  }
  return ["", null]
}

export function checkNoUndefinedVars(parseTree): StaticAnalysisError {
  function helper(node, params: string[]) {
    if (node.nodeType === "expression" && node.expressionType == "vid") {
      if (!params.includes(node.value)) {
        return [`Variable ${node.value} is undefined`, node.id]
      }
    }
    for (const child of children(node)) {
      const error = helper(child, params)
      if (error != undefined) return error
    }
  }

  for (const node of parseTree.functions) {
    const error = helper(node, node.params)
    if (error != undefined) return error
  }
  return ["", null]
}
