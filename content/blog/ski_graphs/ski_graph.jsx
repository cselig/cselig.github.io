import React from "react"
import * as d3 from "d3"

import * as graphUtils from "../../../src/js/graphs.js"

import nodesData from "./data/heavenly/nodes.json"
import edgesData from "./data/heavenly/edges.json"

const SVG_WIDTH = 500,
      SVG_HEIGHT = 500

const colorMap = {
  "blue": "#1E88E5",
  "green": "#229954"
}

const delay = 500
const fadeInText  = () => d3.select("#ski-graph .text").transition().duration(delay).style("opacity", 1)
const fadeOutText = () => d3.select("#ski-graph .text").transition().duration(delay).style("opacity", 0)

class SkiGraph extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      start: null,
      end: null,
    }
  }

  render() {
    const reset = () => {
      this.setState({start: null, end: null})
      d3.selectAll("g.node circle").classed("selected", false)
      d3.selectAll("g.node").transition().duration(500).style("opacity", 1)
      d3.selectAll("g.edge").transition().duration(500).style("opacity", 1)
    }

    let displayText
    let onTextClick
    let textClass = "text"
    if (this.state.start === null) {
      displayText = "Pick start"
    } else if (this.state.end === null) {
      displayText = "Pick end"
    } else {
      // on this graph there should be a path between every pair of nodes
      const [_, path] = graphUtils.bfs(this.state.start, this.state.end, edgesData, nodesData)
      graphUtils.highlightPath(path, () => setTimeout(fadeInText, 500))
      displayText = "Reset"
      onTextClick = reset
      textClass += " reset-button"
    }

    return (
      <div id="ski-graph">
        <p
          onClick={onTextClick}
          className={textClass}
        >{displayText}</p>

        <svg width={SVG_WIDTH} height={SVG_HEIGHT}></svg>
      </div>
    )
  }

  componentDidMount() {
    let svg = d3.select("#ski-graph svg")
    graphUtils.appendSvgDefsD3(svg)

    const onNodeClick = (_, i, nodes) => {
      if (this.state.start != null && this.state.end != null) return

      // this is a pretty clumsy way to do animations but it's simple enough in this case.
      if (this.state.start == null) {
        fadeOutText()
        setTimeout(
          () => {
            this.setState({start: i})
            fadeInText()
          },
          delay
        )
      } else if (this.state.end == null) {
        fadeOutText()
        setTimeout(
          // fading the text back in is handled in a callback after the animation is finished
          () => this.setState({end: i}),
          delay
        )
      }
      d3.select(nodes[i]).classed("selected", true)
    }

    const nodeOpts = {
      onClick: onNodeClick,
    }

    const edgeOpts = {
      strokeFn: (d) => d.level ? colorMap[d.level] : "grey"
    }

    graphUtils.renderEdgesD3(svg, edgesData, nodesData, edgeOpts)
    graphUtils.renderNodesD3(svg, nodesData, nodeOpts)
  }
}

export default SkiGraph
