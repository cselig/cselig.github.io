import React from "react"
import * as d3 from "d3"

import Graph from "./graph.jsx"

import defaultNodes from "./default_nodes.json"
import defaultEdges from "./default_edges.json"

class GraphEditor extends React.Component {
  constructor(props) {
    super(props)

    this.svgRef = React.createRef()

    this.state = {
      nodes: defaultNodes,
      edges: defaultEdges,
      addMode: "nodes", // nodes || edges
    }
  }

  componentDidMount() {
    let svg = d3.select(this.svgRef.current)

    const handleSvgClick = (_, i, elems) => {
      if (this.state.addMode === "edges") return

      const [x, y] = d3.mouse(elems[i])
      this.setState((oldState) => ({nodes: oldState.nodes.concat({x: x, y: y})}))
    }
    svg.on("click", handleSvgClick)
  }

  render() {
    const nodeOpts = {
      onClick: () => console.log("node click")
    }

    return (
      <div className="graph-editor">
          <div className={"add-modes"}>
            <p>Add:</p>
            <p
              onClick={() => this.setState({addMode: "nodes"})}
              className={"add-mode " + (this.state.addMode === "nodes" ? "selected" : "")}
            >Nodes</p>
            <p
              onClick={() => this.setState({addMode: "edges"})}
              className={"add-mode " + (this.state.addMode === "edges" ? "selected" : "")}
            >Edges</p>
          </div>
        <Graph
          nodes={this.state.nodes}
          edges={this.state.edges}
          nodeOpts={nodeOpts}
          svgRef={this.svgRef} />
      </div>
    )
  }
}

export default GraphEditor
