import React from "react"
import * as d3 from "d3"
import * as graphUtils from "../../../src/js/graphs.js"

import nodesData from "./data/test/nodes.json"
import edgesData from "./data/test/edges.json"

const SVG_WIDTH = 500,
      SVG_HEIGHT = 500

class SkiGraph extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      start: null,
      end: null
    }
  }

  render() {
    d3.selectAll("g.node").raise()

    let displayText = ""
    if (this.state.start === null) {
      displayText = "Pick start"
    } else if (this.state.end === null) {
      displayText = "Pick end"
    } else {
      const [is_path, path] = graphUtils.bfs(this.state.start, this.state.end, edgesData, nodesData)
      if (is_path) {
        displayText = "Path: " + path.join('->')
        graphUtils.highlightPath(path)
      } else {
        displayText = "No path found"
      }
    }

    const reset = () => {
      this.setState({start: null, end: null})
      d3.selectAll("g.node circle").classed("selected", false)
      d3.selectAll("g.node").style("opacity", 1)
      d3.selectAll("g.edge").style("opacity", 1)
    }

    return (
      <div id="ski-graph">
        <p>{displayText}</p>
        <button onClick={reset}>Reset</button>
        <svg width={SVG_WIDTH} height={SVG_HEIGHT} style={{"border": "1px solid"}}></svg>
      </div>
    )
  }

  componentDidMount() {
    // coordinates are serialized as percentages
    for (let node of nodesData) {
      node.x *= 0.01 * SVG_WIDTH
      node.y *= 0.01 * SVG_HEIGHT
    }

    let svg = d3.select("#ski-graph svg")
    graphUtils.appendSvgDefsD3(svg)

    const onNodeClick = (_, i, nodes) => {
      if (this.state.start != null && this.state.end != null) return
      if (this.state.start == null) {
        this.setState({start: i})
      } else if (this.state.end == null) {
        this.setState({end: i})
      }
      d3.select(nodes[i]).classed("selected", true)
    }

    const nodeOpts = {
      onClick: onNodeClick,
    }

    const edgeOpts = {
      strokeFn: (d) => d.type === "lift" ? "grey" : d.level,
    }

    graphUtils.renderNodesD3(svg, nodesData, nodeOpts)
    graphUtils.renderEdgesD3(svg, edgesData, nodesData, edgeOpts)

    // doesn't work here for some reason?
    // nodes.raise()

    // hack to make sure that we render so that `nodes.raise()` gets called correctly
    this.setState({dummy: true})
  }
}

export default SkiGraph
