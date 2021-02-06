import React from "react"
import * as d3 from "d3"

import Graph from "./graph.jsx"
import GraphEditor from "./graph_editor.jsx"
import BfsUI from "./bfs_ui.jsx"
import * as graphUtils from "../../../src/js/graphs.js"

import defaultNodes from "./default_nodes.json"
import defaultEdges from "./default_edges.json"

const SVG_WIDTH  = 500,
      SVG_HEIGHT = 500

class GraphUIContainer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      nodes: defaultNodes,
      edges: defaultEdges,
      mode: "edit", // "edit" || "bfs"
      svg: null, // DOM node
      svgClickHandler: null,
      svgMouseMoveHandler: null,
      nodeOpts: null,
      nodeClickHandler: null,
    }

    // Doing it this way because I think member functions lead to stable
    // references as opposed to constructing arrow functions in render().
    this.addNode = this.addNode.bind(this)
    this.addEdge = this.addEdge.bind(this)
    this.setSvgClickHandler = this.setSvgClickHandler.bind(this)
    this.setSvgMouseMoveHandler = this.setSvgMouseMoveHandler.bind(this)
    this.setNodeClickHandler = this.setNodeClickHandler.bind(this)
  }

  // node is { x, y }
  addNode(node) {
    this.setState((oldState) => ({nodes: oldState.nodes.concat(node)}))
  }

  // edge is { start, end }
  addEdge(edge) {
    this.setState((oldState) => ({edges: oldState.edges.concat(edge)}))
  }

  setSvgClickHandler(handler) {
    this.setState({svgClickHandler: handler})
  }

  setSvgMouseMoveHandler(handler) {
    this.setState({svgMouseMoveHandler: handler})
  }

  setNodeClickHandler(handler) {
    this.setState({nodeClickHandler: handler})
  }

  render() {
    console.log(this.state)

    if (this.state.svg ) {
      // for some reason node click handler doesn't get added immediately
      console.log("adding listeners")
      const svgD3 = d3.select(this.state.svg)
      svgD3.on("click", this.state.svgClickHandler)
      svgD3.on("mousemove", (_, i, elems) => this.state.svgMouseMoveHandler(i, elems, this.state.nodes))
      svgD3.selectAll("g.node").on("click", this.state.nodeClickHandler)
    }

    return (
      <div className="graph-ui-container">
        <div className="mode-switch">
          <p onClick={() => this.setState({mode: "edit"})}>Edit Graph</p>
          <p onClick={() => this.setState({mode: "bfs"})} >BFS</p>
        </div>
        {this.state.mode === "edit" &&
          <GraphEditor
            addNode={this.addNode}
            addEdge={this.addEdge}
            svg={this.state.svg}
            setSvgClickHandler={this.setSvgClickHandler}
            setSvgMouseMoveHandler={this.setSvgMouseMoveHandler}
            setNodeClickHandler={this.setNodeClickHandler}
          />
        }
        {this.state.mode === "bfs" &&
          <BfsUI
            nodes={this.state.nodes}
            edges={this.state.edges}
            setNodeClickHandler={this.setNodeClickHandler}
          />
        }
        <Graph
          nodes={this.state.nodes}
          edges={this.state.edges}
          nodeOpts={this.state.nodeOpts}
          // https://reactjs.org/docs/refs-and-the-dom.html#callback-refs
          svgRef={(el) => {
            const svg = d3.select(el)
              .attr("width", SVG_WIDTH)
              .attr("height", SVG_HEIGHT)
            graphUtils.setUpSvg(svg)
            if (this.state.svg == null) this.setState({svg: el})
          }}
          svg={this.state.svg}
        />
      </div>
    )
  }
}

export default GraphUIContainer
