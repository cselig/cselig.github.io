export function buildInheritanceGraph(parseTree) {
  console.log("")
  console.log("building inheritance graph")

  let graph = {} // { name: { id, parent, children } }

  console.log(parseTree.classes)

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
    console.log("->", name, node)
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
