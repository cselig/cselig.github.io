import React from "react"
import * as d3 from "d3"
import * as graphUtils from "../../../src/js/graphs.js"

const SVG_WIDTH  = 500,
      SVG_HEIGHT = 500

class Graph extends React.Component {
  drawD3() {
    if (this.props.svgRef.current) {
      let svg = d3.select(this.props.svgRef.current)
      const { edges, nodes, nodeOpts } = this.props
      graphUtils.renderEdgesD3(svg, edges, nodes)
      graphUtils.renderNodesD3(svg, nodes, nodeOpts)
    }
  }

  componentDidMount() {
    let svg = d3.select(this.props.svgRef.current)
      .attr("width", SVG_WIDTH)
      .attr("height", SVG_HEIGHT)
      .style("border", "3px solid lightcoral")

    graphUtils.appendSvgDefsD3(svg)

    this.drawD3()
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
