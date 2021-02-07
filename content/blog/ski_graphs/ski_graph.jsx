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

// moving these functions out of graphUtils for now.
function makeAdjacencyList(edges, nodes) {
  let adjacencyList = new Map()
  for (const {start, end} of edges) {
    if (adjacencyList.has(start)) {
      adjacencyList.get(start).push(end)
    } else {
      adjacencyList.set(start, [end])
    }
  }
  for (let i = 0; i < nodes.length; i++) {
    if (!adjacencyList.has(i)) adjacencyList.set(i, [])
  }
  return adjacencyList
}

// takes start and end nodes and returns [path_exists, path]
function bfs(start, end, edges, nodes) {
  if (start === end) return [true, [start]]

  const adjacencyList = makeAdjacencyList(edges, nodes)

  let q = [[start]]
  let seen = new Set([start])

  while (!(q.length === 0)) {
    const q_length = q.length
    for (let i = 0; i < q_length; i++) {
      const path = q[i]
      const curr_node = path[path.length - 1]
      for (const neighbor of adjacencyList.get(curr_node)) {
        if (neighbor === end) {
          return [true, path.concat(neighbor)]
        }
        if (!seen.has(neighbor)) {
          seen.add(neighbor)
          q.push(path.concat(neighbor))
        }
      }
    }
    q = q.slice(q_length)
  }
  return [false, []]
}

function highlightPath(path, onAnimationFinish = () => {}, transitionLength = 500, delayUnit = 100) {
  // TODO: it might look better if animation duration depended on edge length
  d3.selectAll("g.node, g.edge").transition().duration(300).style("opacity", 0.3)

  d3.selectAll("g.node")
    .each((_, i, nodes) => {
      if (path.includes(i)) {
        d3.select(nodes[i])
          .transition()
          .duration(transitionLength)
          .delay(path.indexOf(i) * 2 * delayUnit + 3 * delayUnit)
            .style("opacity", 1)
      }
    })

  d3.selectAll("g.edge")
    .each((_, i, nodes) => {
      d3.select(nodes[i])
        .transition()
        .duration(transitionLength)
        .delay((d) => {
          for (let j = 0; j < path.length - 1; j++) {
            if (path[j] === d.start && path[j + 1] === d.end) {
              return (j * 2 + 1)* delayUnit + 3 * delayUnit
            }
          }
        })
          .style("opacity", 1)
    })

  const animationLength = (path.length * 2 + 3) * delayUnit
  setTimeout(onAnimationFinish, animationLength)
}

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
      const [_, path] = bfs(this.state.start, this.state.end, edgesData, nodesData)
      highlightPath(path, () => setTimeout(fadeInText, 500))
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
    graphUtils.setUpSvg(svg)

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

    graphUtils.renderEdgesD3({svg: svg, edgeData: edgesData, nodeData: nodesData, directed: true, opts: edgeOpts})
    graphUtils.renderNodesD3({svg: svg, nodeData: nodesData, opts: nodeOpts})
  }
}

export default SkiGraph
