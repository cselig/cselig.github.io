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
    if (n > 1000) {
      console.warn("Probable infinite loop in BFS code")
      return ["error", []]
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
  render() {
    return (
      <div id="ski-graph">
        <svg width="200" height="200"></svg>
      </div>
    )
  }

  componentDidMount() {
    let svg = d3.select("#ski-graph svg")

    console.log(1, 2, bfs(1, 2))
    console.log(0, 2, bfs(0, 2))
    console.log(3, 0, bfs(3, 0))
    console.log(0, 3, bfs(0, 3))
    console.log(0, 4, bfs(0, 4))

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

    nodes.append("circle")
      .attr("r", 10)

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
