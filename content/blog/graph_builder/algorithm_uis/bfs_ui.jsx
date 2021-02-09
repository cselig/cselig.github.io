import React from "react"
import * as d3 from "d3"

const delay = 500
const fadeInText  = () => d3.select("#bfs .text").transition().duration(delay).style("opacity", 1)
const fadeOutText = () => d3.select("#bfs .text").transition().duration(delay).style("opacity", 0)

// moving these functions out of graphUtils for now
function reciprocateEdges(edges) {
  let result = []
  for (const {start, end} of edges) {
    // could create duplicate edges
    result.push({start: start, end: end})
    result.push({start: end, end :start})
  }
  return result
}

function makeAdjacencyList(edges, nodes) {
  edges = reciprocateEdges(edges)
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
function bfs(start, end, edges, nodes, directed) {
  if (start === end) return [true, [start]]

  const adjacencyList = makeAdjacencyList(edges, nodes, directed)

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

function highlightPath(opts) {
  const defaultOpts = {
    onAnimationFinish: () => null,
    transitionLength: 500,
    delayUnit: 100,
  }
  const { path, onAnimationFinish, transitionLength, delayUnit } = {...defaultOpts, ...opts}

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

  const undirectedEdgeMembershipFn = (d) => {
    for (let i = 0; i < path.length - 1; i++) {
      if (path[i] === d.start && path[i + 1] === d.end ||
          path[i] === d.end && path[i + 1] === d.start) return true
    }
    return false
  }

  d3.selectAll("g.edge")
    .each((d, i, nodes) => {
      if (undirectedEdgeMembershipFn(d)) {
        d3.select(nodes[i])
          .transition()
          .duration(transitionLength)
          .delay((d) => {
            const edgeIndexInPath = Math.min(path.indexOf(d.start), path.indexOf(d.end))
            return (edgeIndexInPath * 2 + 1) * delayUnit + 3 * delayUnit
          })
            .style("opacity", 1)
      }
    })

  const animationLength = (path.length * 2 + 3) * delayUnit
  // TODO: this should get cancelled on unmount
  setTimeout(onAnimationFinish, animationLength)
}


class BfsUI extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      searchStart: null,
      searchEnd: null,
    }
  }

  componentDidMount() {
    const handleNodeClick = (_, i, nodes) => {
      console.log("bfs node click")

      // this is a pretty clumsy way to do animations but it's simple enough in this case.
      if (this.state.searchStart == null) {
        fadeOutText()
        setTimeout(
          () => {
            this.setState({searchStart: i})
            fadeInText()
          },
          delay
        )
      } else if (this.state.searchEnd == null) {
        fadeOutText()
        setTimeout(
          // fading the text back in is handled in a callback after the animation is finished
          () => this.setState({searchEnd: i}),
          delay
        )
      }
      console.log(nodes[i])
      d3.select(nodes[i]).select("circle").style("fill", "red")
    }

    this.props.setNodeClickHandler(handleNodeClick)
  }

  componentWillUnmount() {
    this.props.resetHighlighting()
  }

  render() {
    const reset = () => {
      this.setState({searchStart: null, searchEnd: null})
      this.props.resetHighlighting()
    }

    let displayText
    let onTextClick
    let textClass = "text"
    if (this.state.searchStart === null) {
      displayText = "Pick start"
    } else if (this.state.searchEnd === null) {
      displayText = "Pick end"
    } else {
      const [_, path] = bfs(this.state.searchStart,
                                       this.state.searchEnd,
                                       this.props.edges,
                                       this.props.nodes,
                                       false)
      highlightPath({
        path: path,
        onAnimationFinish: () => setTimeout(fadeInText, 500),
        directed: false,
      })
      displayText = "Reset"
      onTextClick = reset
      textClass += " reset-button"
    }

    return (
      <div id="bfs" className="algorithm-ui">
        <h2>Breadth First Search</h2>
        <p
          onClick={onTextClick}
          className={textClass}
        >{displayText}</p>
      </div>
    )
  }
}

export default BfsUI
