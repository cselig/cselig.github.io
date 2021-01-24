import React from "react"
import * as d3 from "d3"

import * as graphUtils from "../../../src/js/graphs.js"

const SVG_WIDTH  = 500,
      SVG_HEIGHT = 500

class GraphBuilder extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      nodes: [], // {x, y}
      edges: [], // {start, end}
      addMode: "nodes",  // "nodes" || "edges"
      edgeStart: null,   // index of `nodes`
      mouseCoords: null, // [x, y], used when edgeStart has been selected
      finished: false,   // if the graph is finished being built
    }
  }

  componentDidMount() {
    let svg = d3.select("#graph-builder-ui-container")
      .append("svg")
      .attr("width", SVG_WIDTH)
      .attr("height", SVG_HEIGHT)
      .style("border", "3px solid grey")

    const handleSvgClick = (_, i, elems) => {
      if (this.state.addMode === "edges" || this.state.finished) return

      const [x, y] = d3.mouse(elems[i])
      this.setState((oldState) => ({nodes: oldState.nodes.concat({x: x, y: y})}))
    }
    svg.on("click", handleSvgClick)

    const handleSvgMouseMove = (_, i, elems) => {
      const mouseCoords = d3.mouse(elems[i])
      this.setState({mouseCoords: mouseCoords})
    }
    svg.on("mousemove", handleSvgMouseMove)

    graphUtils.appendSvgDefsD3(svg)
  }

  render() {
    let svg = d3.select("#graph-builder-ui-container svg")

    const handleNodeClick = (_, i) => {
      if (this.state.addMode === "nodes" || this.state.finished) return

      if (this.state.edgeStart == null) {
        this.setState({edgeStart: i})
      } else if (this.state.edgeStart !== i) {
        this.setState((oldState) => {
          return {edges: oldState.edges.concat({start: this.state.edgeStart, end: i}),
                  edgeStart: null}
        })
      }
    }

    let nodes = graphUtils.renderNodesD3(svg, this.state.nodes, {onClick: handleNodeClick})
    graphUtils.renderEdgesD3(svg, this.state.edges, this.state.nodes)

    svg.select("g.tmp-edge").remove()
    // draw temp edge
    if (this.state.mouseCoords != null && this.state.edgeStart != null) {
      const x1 = this.state.nodes[this.state.edgeStart].x,
            y1 = this.state.nodes[this.state.edgeStart].y
      const [x2, y2] = this.state.mouseCoords

      const path = graphUtils.generatePath(x1, y1, x2, y2)

      svg.append("g")
        .attr("class", "tmp-edge")
        .append("path")
          .attr("d", path)
          .attr("stroke", "grey")
          .attr("stroke-width", 3)
          .style("opacity", 0.3)
          .attr("marker-mid", "url(#triangle)")
    }

    nodes.raise() // don't want edges to overlap nodes

    const reset = () => {
      this.setState({
        nodes: [],
        edges: [],
        edgeStart: null,
        addMode: "nodes",
        finished: false,
      })
    }

    const finish = () => {
      this.setState({
        finished: true,
        edgeStart: null,
      })
    }

    const edit = () => {
      this.setState({finished: false})
    }

    const setAddMode = (e) => this.setState({addMode: e.target.textContent.toLowerCase()})

    const { addMode, finished } = this.state

    return (
      <div id="graph-builder-ui-container">
        <div id="controls">
          {!finished &&
            <div className="add-modes">
              <p>Add:</p>
              <p
                onClick={setAddMode}
                className={"add-mode " + (addMode === "nodes" ? "selected" : "")}
              >Nodes</p>
              <p
                onClick={setAddMode}
                className={"add-mode " + (addMode === "edges" ? "selected" : "")}
              >Edges</p>
            </div>
          }
          {!finished && <button onClick={finish}>Done</button>}
          {finished  && <button onClick={edit}>Edit</button>}
          <button onClick={reset}>Reset</button>
          {/* only need this for dev */}
          {/* {finished &&
            <div className="results">
              <pre>{JSON.stringify(this.state.nodes)}</pre>
              <pre>{JSON.stringify(this.state.edges)}</pre>
            </div>
          } */}
        </div>
      </div>
    )
  }
}

export default GraphBuilder
