import React from "react"
import * as d3 from "d3"

import Graph from "./graph.jsx"
import * as graphUtils from "../../../src/js/graphs.js"

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
      edgeStart: null,
    }
  }

  componentDidMount() {
    let svg = d3.select(this.svgRef.current)

    const handleSvgClick = (_, i, elems) => {
      if (this.state.addMode !== "nodes") return

      const [x, y] = d3.mouse(elems[i])
      this.setState((oldState) => ({nodes: oldState.nodes.concat({x: x, y: y})}))
    }
    svg.on("click", handleSvgClick)

    const handleSvgMouseMove = (_, i, elems) => {
      svg.select("g.tmp-edge").remove()
      if (!(this.state.addMode === "edges" && this.state.edgeStart != null)) return

      const x1 = this.state.nodes[this.state.edgeStart].x,
            y1 = this.state.nodes[this.state.edgeStart].y
      const [x2, y2] = d3.mouse(elems[i])
      // only drawing a partial path helps with weird mouseover conflicts I think
      const path = graphUtils.generatePartialPath(x1, y1, x2, y2, 0.99)

      svg.append("g")
        .attr("class", "tmp-edge")
        .append("path")
          .attr("d", path)
          .attr("stroke", "grey")
          .attr("stroke-width", 5)
          .style("opacity", 0.3)
          .attr("marker-mid", "url(#triangle)")
    }
    svg.on("mousemove", handleSvgMouseMove)
  }

  render() {
    console.log(this.state)

    const handleNodeClick = (_, i) => {
      if (this.state.addMode !== "edges") return

      if (this.state.edgeStart == null) {
        this.setState({edgeStart: i})
      } else if (this.state.edgeStart !== i) {
        this.setState((oldState) => {
          return {edges: oldState.edges.concat({start: this.state.edgeStart, end: i}),
                  edgeStart: null}
        })
      }
    }
    const nodeOpts = {
      onClick: handleNodeClick,
    }

    return (
      <div className="graph-editor">
          <div className={"add-modes"}>
            <p>Add:</p>
            <p
              onClick={() => this.setState({addMode: "nodes", edgeStart: null})}
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
