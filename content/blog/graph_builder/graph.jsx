import React from "react"
import * as d3 from "d3"
import * as graphUtils from "../../../src/js/graphs.js"

class Graph extends React.Component {
  // TODO: maybe cleaner to have React handle the SVG objects
  drawD3() {
    if (this.props.svg) {
      const svg = d3.select(this.props.svg)
      const { edges, nodes, nodeOpts, edgeOpts } = this.props
      graphUtils.renderEdgesD3({
        svg: svg,
        edgeData: edges,
        nodeData: nodes,
        directed: this.props.directed,
        opts: edgeOpts
      })
      graphUtils.renderNodesD3({
        svg: svg,
        nodeData: nodes,
        opts: nodeOpts
      })
    }
  }

  render() {
    this.drawD3()

    return (
      <div className="graph-container">
        <svg ref={this.props.svgRef}></svg>
      </div>
    )
  }
}

export default Graph
