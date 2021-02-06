import React from "react"
import * as d3 from "d3"
import * as graphUtils from "../../../src/js/graphs.js"

class Graph extends React.Component {
  drawD3() {
    if (this.props.svg) {
      const svg = d3.select(this.props.svg)
      const { edges, nodes, nodeOpts } = this.props
      graphUtils.renderEdgesD3(svg, edges, nodes)
      graphUtils.renderNodesD3(svg, nodes, nodeOpts)
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
