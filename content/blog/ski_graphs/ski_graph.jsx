import React from "react"
import * as d3 from "d3"

const translate = (x, y) => `translate(${x}px,${y}px)`

// generate an svg path from d.start to d.end, adding a point
// in the middle so we can put a marker there.
const generatePath = (d) => {
  const x1 = nodes_data[d.start].x,
        y1 = nodes_data[d.start].y,
        x2 = nodes_data[d.end].x,
        y2 = nodes_data[d.end].y
  return d3.line()(
    [
      [x1, y1],
      [(x1 + x2) / 2, (y1 + y2) / 2],
      [x2, y2],
    ]
  )
}

// takes start and end nodes and returns [path_exists, path]
const bfs = (start, end) => {
  if (start === end) return [true, []]

  let q = [[start]]
  let seen = new Set([start])
  let n = 0

  while (!(q.length === 0)) {
    n++
    const q_length = q.length
    for (let i = 0; i < q_length; i++) {
      const path = q[i]
      const curr_node = path[path.length - 1]
      for (const neighbor of graph_edges.get(curr_node)) {
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
    if (n > 10000) {
      console.warn("Probable infinite loop in BFS code")
      return [false, []]
    }
  }
  return [false, []]
}

// nodes are identified by their index
const nodes_data = [
  {
    x: 100,
    y: 50
  },
  {
    x: 50,
    y: 150
  },
  {
    x: 25,
    y: 100
  },
  {
    x: 150,
    y: 125,
  },
  {
    x: 175,
    y: 50,
  }
]

const edges_data = [
  {
    type: "lift",
    start: 1,
    end: 0
  },
  {
    type: "run",
    level: "blue",
    start: 2,
    end: 1,
  },
  {
    type: "run",
    level: "green",
    start: 0,
    end: 2
  },
  {
    type: "lift",
    start: 1,
    end: 3
  },
  {
    type: "lift",
    start: 3,
    end: 4
  }
]

// maps node -> list of reachable nodes
let graph_edges = new Map()
for (const {start, end} of edges_data) {
  if (graph_edges.has(start)) {
    graph_edges.get(start).push(end)
  } else {
    graph_edges.set(start, [end])
  }
}
for (let i = 0; i < nodes_data.length; i++) {
  if (!graph_edges.has(i)) graph_edges.set(i, [])
}

class SkiGraph extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      start: null,
      end: null
    }
  }

  render() {
    const highlightPath = (path) => {
      const nodeInPath = (i) => path.includes(i)
      const edgeInPath = ({start, end}) => {
        for (let i = 0; i < path.length - 1; i++) {
          if (path[i] === start && path[i + 1] === end) return true
        }
        return false
      }

      d3.selectAll("g.node, g.edge").transition().duration(300).style("opacity", 0.3)

      const transitionLength = 500
      const delayUnit = 100

      d3.selectAll("g.node")
        .each((_, i, nodes) => {
          if (path.includes(i)) {
            d3.select(nodes[i])
              .transition()
              .duration(transitionLength)
              .delay(path.indexOf(i) * 2 * delayUnit + delayUnit)
                .style("opacity", 1)
          }
        })

      d3.selectAll("g.edge")
        .each((d, i, nodes) => {
          console.log(d, i, nodes, path)
          d3.select(nodes[i])
            .transition()
            .duration(transitionLength)
            .delay((d) => {
              for (let j = 0; j < path.length - 1; j++) {
                if (path[j] === d.start && path[j + 1] === d.end) {
                  return (j * 2 + 1)* delayUnit + delayUnit
                }
              }
            })
              .style("opacity", 1)
        })
    }

    let instruction_text = ""
    if (this.state.start === null) {
      instruction_text = "Pick start"
    } else if (this.state.end === null) {
      instruction_text = "Pick end"
    } else {
      const [is_path, path] = bfs(this.state.start, this.state.end)
      if (is_path) {
        instruction_text = "Path: " + path.join('->')
        highlightPath(path)
      } else {
        instruction_text = "No path found"
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
        <p>{instruction_text}</p>
        <button onClick={reset}>Reset</button>
        <svg width="200" height="200"></svg>
      </div>
    )
  }

  componentDidMount() {
    let svg = d3.select("#ski-graph svg")

    svg.append("defs").append("marker")
      .attr("id", "triangle")
      .attr("refY", 3) // fudge factor to make svg scaling work
      .attr("markerWidth", 15)
      .attr("markerHeight", 15)
      .attr("orient", "auto")
      .append("path")
        .attr("d", "M 0 0 12 6 0 12 3 6")
        .style("fill", "black")
        .style("transform", "scale(0.5)")

    let nodes = svg.selectAll("g.node")
      .data(nodes_data)
      .enter().append("g")
        .attr("class", "node")
        .style("transform", (d) => translate(d.x, d.y))

    let edges = svg.selectAll("g.edge")
      .data(edges_data)
      .enter().append("g")
        .attr("class", "edge")

    const onNodeClick = (_, i, nodes) => {
      if (this.state.start != null && this.state.end != null) return
      if (this.state.start == null) {
        this.setState({start: i})
      } else if (this.state.end == null) {
        this.setState({end: i})
      }
      d3.select(nodes[i]).classed("selected", true)
    }

    nodes.append("circle")
      .attr("r", 10)
      .on("click", onNodeClick) // TODO: bind to something that doesn't get overlapped

    nodes.append("text")
      .text((_, i) => i)
      .attr("x", 15)

    edges.append("path")
      .attr("d", generatePath)
      .style("stroke-width", 3)
      .style("stroke", (d) => d.type === "lift" ? "grey" : d.level)
      .attr("marker-mid", "url(#triangle)")
  }
}

export default SkiGraph
