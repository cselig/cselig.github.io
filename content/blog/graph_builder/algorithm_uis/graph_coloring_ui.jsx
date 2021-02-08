import React from "react"
import * as d3 from "d3"

function reciprocateEdges(edges) {
  let result = []
  for (const {start, end} of edges) {
    // could create duplicate edges
    result.push({start: start, end: end})
    result.push({start: end, end :start})
  }
  return result
}

// TODO: misleadingly named
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

const computeInDegrees = (edges) => {
  let nodeToInDegree = new Map()

  const incInDegree = (i) => {
    if (nodeToInDegree.has(i)) {
      nodeToInDegree.set(i, (nodeToInDegree.get(i)) + 1)
    } else {
      nodeToInDegree.set(i, 1)
    }
  }

  for (const { start, end } of edges) {
    incInDegree(start)
    incInDegree(end)
  }

  console.log("in degrees:", nodeToInDegree)
  return nodeToInDegree
}

// using the Welsh Powell algorithm
// https://www.geeksforgeeks.org/welsh-powell-graph-colouring-algorithm/
const computeColoring = (edges, nodes) => {
  const nodeToInDegree = computeInDegrees(edges)
  let vertexes = [] // [[node, inDegree]]
  for (const [node, inDegree] of nodeToInDegree) {
    vertexes.push({node: node, inDegree: inDegree})
  }
  vertexes.sort((e1, e2) => e2.inDegree - e1.inDegree)
  console.log(vertexes)

  const adjacencyList = makeAdjacencyList(edges, nodes)

  let nodeToColor = new Map() // node and color both ints

  const neighborsNodeWithColor = (node, color) => {
    for (const neighbor of adjacencyList.get(node)) {
      if (nodeToColor.get(neighbor) === color) return true
    }
    return false
  }

  let color = 0

  for (let i = 0; i < nodes.length; i++) {
    if (!nodeToColor.has(i)) {
      nodeToColor.set(i, color)

      if (i < nodes.length - 1) {
        for (let j = i + 1; j < nodes.length; j++) {
          if (!neighborsNodeWithColor(j, color)) {
            nodeToColor.set(j, color)
          }
        }
      }
      color++
    }
  }

  return nodeToColor
}

class GraphColoringUI extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      highlighted: false,
    }
    this.highlightNodes = this.highlightNodes.bind(this)
    this.resetHighlighting = this.resetHighlighting.bind(this)
  }

  highlightNodes(nodeToColor) {
    const colors = d3["schemeCategory10"]
    d3.selectAll("g.node > circle")
      .transition().duration(500)
        .style("fill", (_, i) => colors[nodeToColor.get(i)])
    this.setState({highlighted: true})
  }

  resetHighlighting() {
    d3.selectAll("g.node > circle")
      .transition().duration(500)
        .style("fill", "black")
    this.setState({highlighted: false})
  }

  componentWillUnmount() {
    this.resetHighlighting()
  }

  render() {
    const colorGraph = () => {
      const nodeToColor = computeColoring(this.props.edges, this.props.nodes)
      this.highlightNodes(nodeToColor)
    }

    return (
      <div id="graph-coloring" className="algorithm-ui">
        <h2>Graph Coloring</h2>
        {this.state.highlighted ?
          <p className="text" onClick={this.resetHighlighting}>Reset</p>
          :
          <p className="text" onClick={colorGraph}>Color Graph</p>
        }
      </div>
    )
  }
}

export default GraphColoringUI
