export function buildInheritanceGraph(parseTree) {
  let graph = {} // { name: { id, parent, children } }

  for (const c of parseTree.classes) {
    graph[c.className] = {id: c.id}
  }

  let names = new Set() // add(), has()
  for (const c of parseTree.classes) {
    // Check name is not redefined.
    if (names.has(c.className)) {
      return [null, `Class ${c.className} redefined`]
    }
    names.add(c.className)

    // Record parent/child relationship
    if (c.classParent != undefined) {
      graph[c.className].parent = c.classParent
      if (graph[c.classParent].children == undefined) {
        graph[c.classParent].children = []
      }
      graph[c.classParent].children.push(c.className)
    }
  }

  if (hasCycle(graph)) {
    return [null, "Inheritance graph is cyclic."]
  }

  return [graph, ""]
}

function hasCycle(graph) {
  let seen = new Set()
  let stack = []

  for (const [name, node] of Object.entries(graph)) {
    if (node.children != undefined) {
      seen.add(name)
      for (const child of node.children) {
        stack.push(child)
      }
    }
  }

  while (stack.length > 0) {
    const className = stack.pop()
    if (seen.has(className)) {
      return true
    }
    if (graph[className].children != undefined) {
      for (const child of graph[className].children) {
        seen.add(child)
        stack.push(child)
      }
    }
  }

  return false
}

// Type checking

function createTypeCheckError(msg, nodeId) {
  return {
    errorType: "Type check error",
    msg: msg,
    nodeId: nodeId,
  }
}

export function freshTypeEnv() {
  return {
    vars: Array(), // [[name, type], ...]
    methods: {}, // {name: [arg1Type, arg2Type, ... , returnType]}
  }
}

function copy(typeEnv) {
  let newTypeEnv = {
    vars: [...typeEnv.vars],
    methods: {},
  }
  Object.assign(newTypeEnv.methods, typeEnv.methods)
  return newTypeEnv
}

function pushVariable(typeEnv, name, type) {
  typeEnv.vars.push([name, type])
}

function popVariable(typeEnv) {
  typeEnv.vars.pop()
}

function addMethod(typeEnv, m) {
  let signature = []
  for (const p of m.params) {
    signature.push(p.type)
  }
  signature.push(m.returnType)
  typeEnv.methods[m.name] = signature
}

function removeMethod(typeEnv, m) {
  delete typeEnv.methods[m.name]
}

function lookupVariableType(typeEnv, name) {
  const vars = typeEnv.vars
  for (let i = vars.length - 1; i >= 0; i--) {
    console.log("->>>>>>", vars, i)
    if (name === vars[i][0]) return vars[i][1]
  }
  return -1
}

export function typeCheck(parseTreeNode, typeEnv) {
  if (parseTreeNode == undefined) {
    console.warn("undefined"); return;
  }
  switch (parseTreeNode.nodeType) {
    case "program":
      console.log("->> checking program")
      for (const c of parseTreeNode.classes) {
        typeCheck(c, typeEnv)
      }
      return "PROGRAM"
    case "class":
      console.log("->> checking class", copy(typeEnv))
      // type check attribute assignments
      const attrs = parseTreeNode.features.filter(x => x.nodeType === "attribute")
      // An attr can be used in another attr's assignment, so add to symbol table first.
      for (const a of attrs) {
        pushVariable(typeEnv, a.name, a.type)
      }
      for (const a of attrs) {
        typeCheck(a, typeEnv)
      }

      // type check methods
      const methods = parseTreeNode.features.filter(x => x.nodeType === "method")
      for (const m of methods) {
        addMethod(typeEnv, m)
      }
      for (const m of methods) {
        typeCheck(m, typeEnv)
      }

      for (const _ of attrs) popVariable(typeEnv)
      for (const m of methods) removeMethod(typeEnv, m)

      return parseTreeNode.className
    case "attribute":
      console.log("->> checking attribute", copy(typeEnv))
      if (parseTreeNode.assignmentExpr != undefined) {
        const assignmentType = typeCheck(parseTreeNode.assignmentExpr, typeEnv)
        if (assignmentType !== parseTreeNode.type) {
          throw createTypeCheckError(
            `Type mismatch: ${parseTreeNode.type} and ${assignmentType}`,
            parseTreeNode.id,
          )
        }
      }
      return
    case "method":
      console.log("->> checking method", copy(typeEnv))
      for (const p of parseTreeNode.params) {
        pushVariable(typeEnv, p.name, p.type)
      }
      // TODO: check computed type against signature
      const computedType = typeCheck(parseTreeNode.body, typeEnv)
      if (computedType !== parseTreeNode.returnType) {
        console.warn(`Return type does not match up for method: ${parseTreeNode.name}, ${computedType}, ${parseTreeNode.returnType}`)
      }

      for (const _ of parseTreeNode.params) popVariable(typeEnv)
    case "literal":
      return parseTreeNode.type
    case "expression":
      return typeCheckExpression(parseTreeNode, typeEnv)
    case "identifier":
      console.log("->> checking identifier", copy(typeEnv))
      const type = lookupVariableType(typeEnv, parseTreeNode.value)
      if (type === -1) {
        throw createTypeCheckError(
          `Variable not in scope: ${parseTreeNode.value}`,
          parseTreeNode.id,
        )
      }
      return type
  }
}

function typeCheckExpression(parseTreeNode, typeEnv) {
  switch (parseTreeNode.expressionType) {
    case "operation":
      return typeCheckExpressionOperation(parseTreeNode, typeEnv)
    case "let":
      console.log("->> checking let", copy(typeEnv))
      // TODO: check assignments for let variables
      // TODO: add to symbol table
      for (const v of parseTreeNode.variables) {
        pushVariable(typeEnv, v.name, v.type)
      }
      const computedType = typeCheck(parseTreeNode.body, typeEnv)
      for (const _ of parseTreeNode.variables) {
        popVariable(typeEnv)
      }
      return computedType
    case "block":
      console.log("->> checking block", copy(typeEnv))
      for (const e of parseTreeNode.body) {
        // TODO: return type of last expression
        typeCheck(e, typeEnv)
      }
      return
  }
}

function typeCheckExpressionOperation(parseTreeNode, typeEnv) {
  switch (parseTreeNode.operator) {
    case '+':
      console.log('->> checking plus operator', copy(typeEnv))
      const lhsType = typeCheck(parseTreeNode.lhs, typeEnv)
      const rhsType = typeCheck(parseTreeNode.rhs, typeEnv)
      if (lhsType != 'Int') {
        throw createTypeCheckError(
          `Expected Int for operator +, got ${lhsType}`,
          parseTreeNode.id,
        )
      } else if (rhsType != 'Int') {
        throw createTypeCheckError(
          `Expected Int for operator +, got ${rhsType}`,
          parseTreeNode.id,
        )
      }
      return
  }
}
