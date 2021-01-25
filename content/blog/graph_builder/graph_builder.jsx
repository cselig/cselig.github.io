import React from "react"
import * as d3 from "d3"
import * as graphUtils from "../../../src/js/graphs.js"

import defaultNodes from "./default_nodes.json"
import defaultEdges from "./default_edges.json"

// deep copies an array of objects
function arrayDeepCopy(arr) {
  return Object.assign([], arr).map((x) => Object.assign({}, x))
}

const SVG_WIDTH  = 500,
      SVG_HEIGHT = 500

class GraphBuilder extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      nodes: [],         // [{x, y}]
      edges: [],         // [{start, end}]
      addMode: "nodes",  // "nodes" || "edges"
      edgeStart: null,   // index of `nodes`
      mouseCoords: null, // [x, y], used when edgeStart has been selected
      editing: false,    // if the graph is being edited
      searchStart: null, // node to search from
      searchEnd: null,   // node to search to
      path: null,        // path between searchStart and searchEnd
    }
  }

  imperativelyRender() {
    // strange hack so that nodes.raise() gets called properly
    setTimeout(
      () => this.setState((oldState) => ({dummy: oldState.dummy === undefined ? true : !oldState.dummy})),
      10
    )
  }

  componentDidMount() {
    let svg = d3.select("#svg-placeholder")
      .insert("svg")
      .attr("width", SVG_WIDTH)
      .attr("height", SVG_HEIGHT)
      .style("border", "3px solid grey")

    const handleSvgClick = (_, i, elems) => {
      if (this.state.addMode === "edges" || !this.state.editing) return

      const [x, y] = d3.mouse(elems[i])
      this.setState((oldState) => ({nodes: oldState.nodes.concat({x: x, y: y})}))
    }
    svg.on("click", handleSvgClick)

    const handleSvgMouseMove = (_, i, elems) => {
      if (!this.state.editing) return

      const mouseCoords = d3.mouse(elems[i])
      this.setState({mouseCoords: mouseCoords})
    }
    svg.on("mousemove", handleSvgMouseMove)

    graphUtils.appendSvgDefsD3(svg)

    this.setState({
      nodes: arrayDeepCopy(defaultNodes),
      edges: arrayDeepCopy(defaultEdges),
    })

    this.imperativelyRender()
  }

  // FIXME: very bad hack that I think shouldn't be necessary. For some reason
  // when applying a click handler to both enter and update node groups, it appears
  // to be called twice on every click. For this reason, only ever have enter groups
  // and use this function to clear the SVG imperatively between state changes.
  // I think probably a refactor of all this code would fix the issue.
  clearCanvas() {
    d3.selectAll("g.node, g.edge").remove()
  }

  render() {
    let svg = d3.select("#graph-builder-ui-container svg")

    const handleNodeClickEditing = (_, i) => {
      if (this.state.addMode === "nodes" || !this.state.editing) return

      if (this.state.edgeStart == null) {
        this.setState({edgeStart: i})
      } else if (this.state.edgeStart !== i) {
        this.setState((oldState) => {
          return {edges: oldState.edges.concat({start: this.state.edgeStart, end: i}),
                  edgeStart: null}
        })
      }
    }

    const handleNodeClickSearching = (_, i) => {
      if (this.state.editing) return

      if (this.state.searchStart == null) {
        this.setState({searchStart: i})
      } else if (this.state.searchEnd == null) {
        this.setState({searchEnd: i})
      }
    }

    let nodes = graphUtils.renderNodesD3(
      svg, this.state.nodes, {onClick: this.state.editing? handleNodeClickEditing : handleNodeClickSearching}
    )
    graphUtils.renderEdgesD3(svg, this.state.edges, this.state.nodes)

    // draw ghost edge
    svg.select("g.tmp-edge").remove()
    if (this.state.addMode === "edges" && this.state.edgeStart != null) {
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

    // draw ghost node
    svg.select("g.tmp-node").remove()
    if (this.state.editing && this.state.addMode === "nodes" && this.state.mouseCoords) {
      const [x, y] = this.state.mouseCoords

      svg.append("g")
        .attr("class", "tmp-node")
        .style("transform", `translate(${x}px,${y}px)`)
        .append("circle")
          .attr("r", 5)
          .attr("fill", "green")
          .style("opacity", 0.3)
    }

    nodes.raise() // don't want edges to overlap nodes

    const resetSearchState = () => {
      this.setState({
        searchStart: null,
        searchEnd: null,
        path: null,
      })
      d3.selectAll("g.node").transition().duration(500).style("opacity", 1)
      d3.selectAll("g.edge").transition().duration(500).style("opacity", 1)
    }

    const clear = () => {
      this.setState({
        nodes: [],
        edges: [],
        edgeStart: null,
        addMode: "nodes",
        editing: true,
        searchStart: null,
        searchEnd: null,
        path: null,
      })
    }

    const reset = () => {
      this.clearCanvas()
      this.setState({
        nodes: arrayDeepCopy(defaultNodes),
        edges: arrayDeepCopy(defaultEdges),
        edgeStart: null,
        addMode: "nodes",
        editing: false,
        mouseCoors: null,
      })
      this.imperativelyRender()
    }

    const finish = () => {
      this.clearCanvas()
      this.setState({
        editing: false,
        edgeStart: null,
        mouseCoords: null,
      })
      this.imperativelyRender()
    }

    const edit = () => {
      this.clearCanvas()
      this.setState({editing: true})
      this.imperativelyRender()
      resetSearchState()
    }

    const setAddMode = (e) => {
      this.clearCanvas()
      this.setState({addMode: e.target.textContent.toLowerCase()})
      this.imperativelyRender()
    }

    // FIXME: bad code
    let pathText = ""
    if (this.state.searchStart && this.state.searchEnd && !this.state.path) {
      const [is_path, path] = graphUtils.bfs(
        this.state.searchStart, this.state.searchEnd, this.state.edges, this.state.nodes
      )
      if (is_path) {
        pathText = path.join("->")
        const animationLength = graphUtils.highlightPath(path)
        setTimeout(resetSearchState, animationLength + 1500)
      } else {
        pathText = "No path found"
        setTimeout(resetSearchState, 1500)
      }
    }

    const { addMode, editing, searchStart, searchEnd } = this.state

    return (
      <div id="graph-builder-ui-container">
        <div className="controls">
          <div className="buttons">
            {editing  && <button onClick={finish}>Search</button>}
            {!editing && <button onClick={edit}>Edit</button>}
            <button onClick={reset}>Reset to default</button>
            <button onClick={clear}>Clear</button>
          </div>

          <div className={"add-modes " + (editing ? "" : "inactive")}>
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

          {/* this gets messy fast, should probably separate graph/editor/search into components */}
          <div className={"search-text " + (editing ? "inactive" : "")}>
            <p>{"Start node: " + searchStart}</p>
            <p>{"End node: " + searchEnd}</p>
            <p>{"Path: " + pathText}</p>
          </div>

          <div id="svg-placeholder"></div>
          {/* only need this for dev */}
          {/* {!editing &&
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
