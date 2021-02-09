import React from "react"
import * as d3 from "d3"

const delay = 500
const fadeInText  = () => d3.select("#connected-components .text").transition().duration(delay).style("opacity", 1)
const fadeOutText = () => d3.select("#connected-components .text").transition().duration(delay).style("opacity", 0)

// TODO: share these
function reciprocateEdges(edges) {
  let result = []
  for (const {start, end} of edges) {
    // could create duplicate edges
    result.push({start: start, end: end})
    result.push({start: end, end :start})
  }
  return result
}

function makeAdjacencyList(edges, nodes) {
  edges = reciprocateEdges(edges)
  let adjacencyList = new Map()
  for (const {start, end} of edges) {
    if (adjacencyList.has(start)) {
      adjacencyList.get(start).push(end)
    } else {
      adjacencyList.set(start, [end])
    }
  }
  for (let i = 0; i < nodes.length; i++) {
    if (!adjacencyList.has(i)) adjacencyList.set(i, [])
  }
  return adjacencyList
}

const explore = (start, adjacencyList, seen) => {
  let result = new Set([start])
  seen.add(start)
  let q = [start]

  while(!(q.length === 0)) {
    const q_length = q.length
    for (let i = 0; i < q_length; i++) {
      const curr = q[i]
      for (const neighbor of adjacencyList.get(curr)) {
        if (!seen.has(neighbor)) {
          seen.add(neighbor)
          result.add(neighbor)
          q.push(neighbor)
        }
      }
    }
    q = q.slice(q_length)
  }

  return result
}

const findComponents = (nodes, edges) => {
  const adjacencyList = makeAdjacencyList(edges, nodes)
  let result = []
  let seen = new Set()

  for (let node = 0; node < nodes.length; node++) {
    if (!seen.has(node)) {
      const componentNodes = explore(node, adjacencyList, seen)
      result.push(componentNodes)
    }
  }

  return result
}

const highlightComponents = (components) => {
  let nodeToComponent = new Map()
  for (let i = 0; i < components.length; i++) {
    for (const node of components[i]) {
      nodeToComponent.set(node, i)
    }
  }
  console.log(components, nodeToComponent)

  const colors = d3["schemeCategory10"]

  d3.selectAll("g.node, g.edge").transition().duration(300).style("opacity", 0.3)

  d3.selectAll("g.node")
    .transition()
    .duration(delay)
    .delay((_, i) => nodeToComponent.get(i) * delay + delay)
      .style("opacity", 1)
      .select("circle")
        .style("fill", (_, i) => colors[nodeToComponent.get(i)])

  d3.selectAll("g.edge")
    .transition()
    .duration(delay)
    .delay((d) => nodeToComponent.get(d.start) * delay + delay)
      .style("opacity", 1)
}

class ConnectedComponentsUI extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      highlighted: false
    }
  }

  render() {
    const doHighlight = () => {
      const components = findComponents(this.props.nodes, this.props.edges)
      console.log("components", components)
      highlightComponents(components)
      fadeOutText()
      setTimeout(
        () => this.setState({highlighted: true}),
        delay
      )
      setTimeout(
        fadeInText,
        delay * components.length + delay
      )
    }

    const reset = () => {
      this.props.resetHighlighting()
      this.setState({highlighted: false})
    }

    return (
      <div id="connected-components" className="algorithm-ui">
        <h2>Connected Components</h2>
        {this.state.highlighted ?
          <p className="text" onClick={reset}>Reset</p>
          :
          <p className="text" onClick={doHighlight}>Highlight connected components</p>
        }
      </div>
    )
  }

  componentWillUnmount() {
    this.props.resetHighlighting()
  }
}

export default ConnectedComponentsUI
