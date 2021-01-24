import React from "react"
import * as d3 from "d3"

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
    }
  }

  componentDidMount() {
    let svg = d3.select("#graph-builder-ui-container")
      .append("svg")
      .attr("width", SVG_WIDTH)
      .attr("height", SVG_HEIGHT)
      .style("border", "3px solid grey")

    const handleSvgClick = (_, i, elems) => {
      if (this.state.addMode === "edges") return

      const [x, y] = d3.mouse(elems[i])
      this.setState((oldState) => ({nodes: oldState.nodes.concat({x: x, y: y})}))
    }
    svg.on("click", handleSvgClick)

    const handleSvgMouseMove = (_, i, elems) => {
      const mouseCoords = d3.mouse(elems[i])
      this.setState({mouseCoords: mouseCoords})
    }
    svg.on("mousemove", handleSvgMouseMove)

    // direction marker
    svg.append("defs").append("marker")
      .attr("id", "triangle")
      .attr("refY", 2) // fudge factor to make svg scaling work
      .attr("markerWidth", 15)
      .attr("markerHeight", 15)
      .attr("orient", "auto")
      .append("path")
        .attr("d", "M 0 0 12 6 0 12 3 6")
        .style("fill", "black")
        .style("transform", "scale(0.3)")
  }

  render() {
    let svg = d3.select("#graph-builder-ui-container svg")

    let nodes = svg.selectAll("g.node")
      .data(this.state.nodes)

    const handleNodeClick = (_, i, elems) => {
      if (this.state.addMode === "nodes") return

      if (this.state.edgeStart == null) {
        this.setState({edgeStart: i})
      } else {
        svg.selectAll("g.tmp-edge").remove()
        this.setState((oldState) => {
          return {edges: oldState.edges.concat({start: this.state.edgeStart, end: i}),
                  edgeStart: null}
        })
      }
    }

    nodes.enter().append("g")
        .attr("class", "node")
        .style("transform", (d) => `translate(${d.x}px,${d.y}px)`)
        .append("circle")
          .attr("r", 5)
          .on("mouseover", (_, i, elems) => d3.select(elems[i]).attr("fill", "green").attr("r", 7))
          .on("mouseout",  (_, i, elems) => d3.select(elems[i]).attr("fill", "black").attr("r", 5))
          .on("click", handleNodeClick)

    nodes.exit().remove()

    let edges = svg.selectAll("g.edge")
      .data(this.state.edges)

    // generate an svg path from d.start to d.end, adding a point
    // in the middle so we can put a marker there.
    const generatePath = (x1, y1, x2, y2) => {
      return d3.line()(
        [
          [x1, y1],
          [(x1 + x2) / 2, (y1 + y2) / 2],
          [x2, y2],
        ]
      )
    }

    const generatePathFromEdge = (edge) => {
      const x1 = this.state.nodes[edge.start].x,
            y1 = this.state.nodes[edge.start].y,
            x2 = this.state.nodes[edge.end].x,
            y2 = this.state.nodes[edge.end].y
      return generatePath(x1, y1, x2, y2)
    }

    edges.enter().append("g")
      .attr("class", "edge")
      .append("path")
        .attr("d", generatePathFromEdge)
        .attr("stroke", "grey")
        .attr("stroke-width", 3)
        .attr("marker-mid", "url(#triangle)")

    // draw temp edge
    if (this.state.mouseCoords != null && this.state.edgeStart != null) {
      // for some reason putting the remove here instead of outside this if
      // statement results in smoother rendering, although it means the temp
      // edge has to be cleaned up in more places
      svg.selectAll("g.tmp-edge").remove()

      let tmpEdge = svg.selectAll("g.tmp-edge")
        .data([[this.state.edgeStart, ""]])

      const x1 = this.state.nodes[this.state.edgeStart].x,
            y1 = this.state.nodes[this.state.edgeStart].y
      const [x2, y2] = this.state.mouseCoords

      const path = generatePath(x1, y1, x2, y2)

      tmpEdge.enter().append("g")
        .attr("class", "tmp-edge")
        .append("path")
          .attr("d", path)
          .attr("stroke", "grey")
          .attr("stroke-width", 3)
          .style("opacity", 0.5)
          .attr("marker-mid", "url(#triangle)")
    }

    edges.exit().remove()

    nodes.raise() // don't want edges to overlap nodes

    const reset = () => {
      svg.selectAll("g.tmp-edge").remove()
      this.setState({nodes: [], edges: [], edgeStart: null})
    }

    const setAddMode = (e) => this.setState({addMode: e.target.textContent.toLowerCase()})

    const { addMode } = this.state

    return (
      <div id="graph-builder-ui-container">
        <div id="controls">
          <div className="add-modes">
            <p onClick={setAddMode} className={addMode === "nodes" ? "selected" : ""}>Nodes</p>
            <p onClick={setAddMode} className={addMode === "edges" ? "selected" : ""}>Edges</p>
          </div>
          <button onClick={reset}>Reset</button>
        </div>
      </div>
    )
  }
}

export default GraphBuilder
