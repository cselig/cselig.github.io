import React from "react"
import * as d3 from "d3"

import Graph from "./graph.jsx"
import * as graphUtils from "../../../src/js/graphs.js"

import defaultNodes from "./default_nodes.json"
import defaultEdges from "./default_edges.json"

class GraphEditor extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      addMode: "nodes", // nodes || edges
      edgeStart: null,
    }
  }

  componentDidMount() {
    const handleSvgClick = (_, i, elems) => {
      if (this.state.addMode !== "nodes") return

      const [x, y] = d3.mouse(elems[i])
      this.props.addNode({x: x, y: y})
    }

    const handleSvgMouseMove = (i, elems, nodes) => {
      let svg = d3.select(this.props.svg)
      svg.select("g.tmp-edge").remove()
      if (!(this.state.addMode === "edges" && this.state.edgeStart != null)) return

      const x1 = nodes[this.state.edgeStart].x,
            y1 = nodes[this.state.edgeStart].y
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

    const handleNodeClick = (_, i) => {
      console.log("editor node click")
      if (this.state.addMode !== "edges") return

      if (this.state.edgeStart == null) {
        this.setState({edgeStart: i})
      } else if (this.state.edgeStart !== i) {
        this.props.addEdge({start: this.state.edgeStart, end: i})
        this.setState({edgeStart: null})
        d3.select(this.props.svg).select("g.tmp-edge").remove()
      }
    }

    this.props.setSvgClickHandler(handleSvgClick)
    this.props.setSvgMouseMoveHandler(handleSvgMouseMove)
    this.props.setNodeClickHandler(handleNodeClick)
  }

  componentWillUnmount() {
    // might be better to explicitly unbind these functions from the svg events
    this.props.setSvgClickHandler(() => null)
    this.props.setSvgMouseMoveHandler(() => null)
    this.props.setNodeClickHandler(() => null)
  }

  render() {
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
      </div>
    )
  }
}

export default GraphEditor
