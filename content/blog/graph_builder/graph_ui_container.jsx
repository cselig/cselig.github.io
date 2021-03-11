import React from "react"
import * as d3 from "d3"

import Graph from "./graph.jsx"
import GraphEditor from "./graph_editor.jsx"
import ConnectedComponentsUI from "./algorithm_uis/connected_components_ui.jsx"

import * as graphUtils from "../../../src/js/graphs.js"

import islandsNodes from "./data/islands/nodes.json"
import islandsEdges from "./data/islands/edges.json"

const SVG_WIDTH  = 500,
      SVG_HEIGHT = 500

const defaultNodeOpts = {
  radius: 8,
  mouseoverRadius: 10,
  fill: "black",
}

const defaultEdgeOpts = {}

const AlgorithmCard = ({ name, setMode, value }) => (
  <div className="algorithm-card" onClick={() => setMode(value)}>
    <p>{name}</p>
  </div>
)

function AlgorithmContainer({ mode, setMode, algorithmInputs }) {
  return (
    <div className="algorithm-container">
      {mode === "connected-components" ?
        <ConnectedComponentsUI
          nodes={algorithmInputs.nodes}
          edges={algorithmInputs.edges}
          nodeOpts={algorithmInputs.nodeOpts}
          resetHighlighting={algorithmInputs.resetHighlighting}
        />
        :
        <AlgorithmCard name="Connected Components" setMode={setMode} value="connected-components" />
      }
    </div>
  )
}

// used to create presets
const Debug = ({ nodes, edges }) => {
  // serialize node position data as percent of width/height
  const scaledNodes = nodes.map(({ x, y }) => ({ x: x/SVG_WIDTH, y: y/SVG_HEIGHT }))
  return (
    <div className="debug">
      <p>Nodes:</p>
      <pre>{JSON.stringify(scaledNodes, null, 2)}</pre>
      <hr></hr>
      <p>Edges:</p>
      <pre>{JSON.stringify(edges, null, 2)}</pre>
    </div>
  )
}

class GraphUIContainer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      nodes: graphUtils.scaleNodeData(islandsNodes, SVG_WIDTH, SVG_HEIGHT),
      edges: islandsEdges,
      mode: null, // null || "add-nodes" || "add-edges" || "algorithm"
      svg: null, // DOM node
      svgClickHandler: null,
      svgMouseMoveHandler: null,
      svgMouseLeaveHandler: null,
      nodeClickHandler: null,
    }

    // Doing it this way because I think member functions lead to stable
    // references as opposed to constructing arrow functions in render().
    this.addNode = this.addNode.bind(this)
    this.addEdge = this.addEdge.bind(this)
    this.setSvgClickHandler = this.setSvgClickHandler.bind(this)
    this.setSvgMouseMoveHandler = this.setSvgMouseMoveHandler.bind(this)
    this.setSvgMouseLeaveHandler = this.setSvgMouseLeaveHandler.bind(this)
    this.setNodeClickHandler = this.setNodeClickHandler.bind(this)
    this.setNodes = this.setNodes.bind(this)
    this.setEdges = this.setEdges.bind(this)
    this.setMode = this.setMode.bind(this)
    this.setPreset = this.setPreset.bind(this)
  }

  // node is { x, y }
  addNode(node) {
    this.setState((oldState) => ({nodes: oldState.nodes.concat(node)}))
  }

  // edge is { start, end }
  addEdge(edge) {
    this.setState((oldState) => ({edges: oldState.edges.concat(edge)}))
  }

  setNodes(nodes) {
    this.resetHighlighting()
    this.setState({nodes: nodes})
  }

  setEdges(edges) {
    this.resetHighlighting()
    this.setState({edges: edges})
  }

  setMode(mode) {
    this.setState({mode: mode})
  }

  setPreset(nodes, edges) {
    this.setState({nodes: nodes, edges: edges, mode: null})
  }

  setSvgClickHandler(handler) {
    this.setState({svgClickHandler: handler})
  }

  setSvgMouseMoveHandler(handler) {
    this.setState({svgMouseMoveHandler: handler})
  }

  setSvgMouseLeaveHandler(handler) {
    this.setState({svgMouseLeaveHandler: handler})
  }

  setNodeClickHandler(handler) {
    this.setState({nodeClickHandler: handler})
  }

  resetHighlighting() {
    // anything that an algorithm UI does should be undone here
    const t = d3.transition().duration(500)
    d3.selectAll("g.node").transition(t)
      .style("opacity", 1)
      .select("circle")
        .style("fill", defaultNodeOpts.fill)
        .attr("r", defaultNodeOpts.radius)
    d3.selectAll("g.edge").transition(t)
      .style("opacity", 1)
  }

  render() {
    if (this.state.svg) {
      // Might be cleanest to pass these functions into an `updateSVG` function in graphUtils
      const svgD3 = d3.select(this.state.svg)
      svgD3.on("click", this.state.svgClickHandler)
      // TODO: bad code
      svgD3.on("mousemove", (_, i, elems) => this.state.svgMouseMoveHandler ? this.state.svgMouseMoveHandler(i, elems, this.state.nodes) : null)
      svgD3.on("mouseleave", this.state.svgMouseLeaveHandler)
    }

    const nodeOpts = {
      onClick: this.state.nodeClickHandler,
    }

    return (
      <div className="graph-ui-container">
        <div className="editor-panel">
          <div className="edit-container">
            {this.state.mode === "add-nodes" || this.state.mode === "add-edges" ?
              <GraphEditor
                addNode={this.addNode}
                addEdge={this.addEdge}
                svg={this.state.svg}
                setSvgClickHandler={this.setSvgClickHandler}
                setSvgMouseMoveHandler={this.setSvgMouseMoveHandler}
                setSvgMouseLeaveHandler={this.setSvgMouseLeaveHandler}
                setNodeClickHandler={this.setNodeClickHandler}
                setNodes={this.setNodes}
                setEdges={this.setEdges}
                mode={this.state.mode}
                setMode={this.setMode}
              /> :
              <p className="edit-button" onClick={() => this.setMode("add-nodes")}>Click to edit graph</p>
            }
          </div>
          <hr></hr>
          <div className="algorithm-container">
            {this.state.mode === "algorithm" ?
              <ConnectedComponentsUI
                nodes={this.state.nodes}
                edges={this.state.edges}
                nodeOpts={{...defaultNodeOpts, ...nodeOpts}}
                resetHighlighting={this.resetHighlighting}
                setMode={this.setMode}
              /> :
              <p
                className="start-button"
                onClick={() => this.setState({mode: "algorithm"})}>
                Click to compute connected components
              </p>
            }
          </div>
        </div>
        <Graph
          nodes={this.state.nodes}
          edges={this.state.edges}
          nodeOpts={{...defaultNodeOpts, ...nodeOpts}}
          edgeOpts={defaultEdgeOpts}
          directed={false}
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
