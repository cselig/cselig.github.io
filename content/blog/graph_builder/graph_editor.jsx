import React from "react"
import * as d3 from "d3"

import * as graphUtils from "../../../src/js/graphs.js"

class GraphEditor extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      edgeStart: null,
    }

    this.clearGhosts = this.clearGhosts.bind(this)
  }

  clearGhosts() {
    let svg = d3.select(this.props.svg)
    svg.select("g.ghost-edge").remove()
    svg.select("g.ghost-node").remove()
  }

  componentDidMount() {
    const handleSvgClick = (_, i, elems) => {
      if (this.props.mode !== "add-nodes") return

      const [x, y] = d3.mouse(elems[i])
      this.props.addNode({x: x, y: y})
    }

    const drawGhostEdge = (elem, nodes) => {
      let svg = d3.select(this.props.svg)
      const x1 = nodes[this.state.edgeStart].x,
            y1 = nodes[this.state.edgeStart].y
      const [x2, y2] = d3.mouse(elem)
      // only drawing a partial path helps with weird mouseover conflicts I think
      const path = graphUtils.generatePartialPath(x1, y1, x2, y2, 0.99)

      svg.append("g")
        .attr("class", "ghost-edge")
        .append("path")
          .attr("d", path)
          .attr("stroke", "grey")
          .attr("stroke-width", 5)
          .style("opacity", 0.3)
    }

    const drawGhostNode = (elem) => {
      let svg = d3.select(this.props.svg)
      const [x, y] = d3.mouse(elem)
      svg.append("g")
        .attr("class", "ghost-node")
        .style("transform", `translate(${x}px,${y}px)`)
        .append("circle")
          .attr("r", 7)
          .attr("fill", "green")
          .style("opacity", 0.3)
    }

    const handleSvgMouseMove = (i, elems, nodes) => {
      this.clearGhosts()

      if (this.props.mode === "add-nodes") {
        drawGhostNode(elems[i])
      } else if (this.props.mode === "add-edges" && this.state.edgeStart != null) {
        drawGhostEdge(elems[i], nodes)
      }
    }

    const handleNodeClick = (_, i) => {
      console.log("editor node click")
      if (this.props.mode !== "add-edges") return

      if (this.state.edgeStart == null) {
        this.setState({edgeStart: i})
      } else if (this.state.edgeStart !== i) {
        this.props.addEdge({start: this.state.edgeStart, end: i})
        this.setState({edgeStart: null})
        this.clearGhosts()
      }
    }

    this.props.setSvgClickHandler(handleSvgClick)
    this.props.setSvgMouseMoveHandler(handleSvgMouseMove)
    this.props.setSvgMouseLeaveHandler(this.clearGhosts)
    this.props.setNodeClickHandler(handleNodeClick)
  }

  componentWillUnmount() {
    this.props.setSvgClickHandler(() => null)
    this.props.setSvgMouseMoveHandler(() => null)
    this.props.setNodeClickHandler(() => null)
    this.clearGhosts()
  }

  render() {
    const toggleAddMode = (addMode) => {
      this.props.setMode(addMode)
      this.setState({edgeStart: null})
      this.clearGhosts()
    }

    const clearGraph = () => {
      this.props.setNodes([])
      this.props.setEdges([])
    }

    return (
      <div className="graph-editor">
        <div className={"add-modes"}>
          <p>Add:</p>
          <p
            onClick={() => toggleAddMode("add-nodes")}
            className={"add-mode " + (this.props.mode === "add-nodes" ? "selected" : "")}
          >Nodes</p>
          <p
            onClick={() => toggleAddMode("add-edges")}
            className={"add-mode " + (this.props.mode === "add-edges" ? "selected" : "")}
          >Edges</p>
        </div>
        <button onClick={clearGraph}>Clear Graph</button>
      </div>
    )
  }
}

export default GraphEditor
