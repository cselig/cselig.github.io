import React from "react"
import * as d3 from "d3"

import Graph from "./graph.jsx"
import GraphEditor from "./graph_editor.jsx"
import BfsUI from "./algorithm_uis/bfs_ui.jsx"
import ConnectedComponentsUI from "./algorithm_uis/connected_components_ui.jsx"
import GraphColoringUI from "./algorithm_uis/graph_coloring_ui.jsx"
import * as graphUtils from "../../../src/js/graphs.js"

import defaultNodes from "./data/default_nodes.json"
import defaultEdges from "./data/default_edges.json"

const SVG_WIDTH  = 500,
      SVG_HEIGHT = 500

const defaultNodeOpts = {
  radius: 8,
  mouseoverRadius: 10,
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
      {mode === "bfs" ?
        <BfsUI
          nodes={algorithmInputs.nodes}
          edges={algorithmInputs.edges}
          setNodeClickHandler={algorithmInputs.setNodeClickHandler}
        />
        :
        <AlgorithmCard name="Breadth First Search" setMode={setMode} value="bfs" />
      }
      {mode === "connected-components" ?
        <ConnectedComponentsUI
          nodes={algorithmInputs.nodes}
          edges={algorithmInputs.edges}
        />
        :
        <AlgorithmCard name="Connected Components" setMode={setMode} value="connected-components" />
      }
      {mode === "graph-coloring" ?
        <GraphColoringUI
          nodes={algorithmInputs.nodes}
          edges={algorithmInputs.edges}
        />
        :
        <AlgorithmCard name="Graph Coloring" setMode={setMode} value="graph-coloring" />
      }
    </div>
  )
}

class GraphUIContainer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      nodes: defaultNodes,
      edges: defaultEdges,
      mode: null, // null || "edit" || "bfs"
      svg: null, // DOM node
      svgClickHandler: null,
      svgMouseMoveHandler: null,
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
    if (this.state.svg ) {
      // Might be cleanest to pass these functions into an `updateSVG` function in graphUtils
      const svgD3 = d3.select(this.state.svg)
      svgD3.on("click", this.state.svgClickHandler)
      // TODO: bad code
      svgD3.on("mousemove", (_, i, elems) => this.state.svgMouseMoveHandler ? this.state.svgMouseMoveHandler(i, elems, this.state.nodes) : null)
    }

    const nodeOpts = {
      onClick: this.state.nodeClickHandler,
    }

    return (
      <div className="graph-ui-container">
        <div className="editor-panel">
          <button
            onClick={() => this.setState({mode: this.state.mode === "edit" ? null : "edit"})}
          >
            {this.state.mode === "edit" ? "Done" : "Edit"}
          </button>
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
        </div>
        <div className="container">
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
          <AlgorithmContainer
            mode={this.state.mode}
            setMode={(mode) => this.setState({mode: mode})}
            algorithmInputs={{nodes: this.state.nodes,
                              edges: this.state.edges,
                              setNodeClickHandler: this.setNodeClickHandler}}
          />
        </div>
      </div>
    )
  }
}

export default GraphUIContainer
