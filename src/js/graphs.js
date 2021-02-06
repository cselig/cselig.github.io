import * as d3 from "d3"

// Assumptions:
//  - Graph representation has format:
//     nodes: [{x, y}]
//     edges: [{start, end}]
//  - g.node and g.edge groups are used to contain elements

// TODO: these functions should probably all take objects as params

///// RENDERING /////

// generate an svg path from d.start to d.end, adding a point
// in the middle so we can put a marker there.
export function generatePath(x1, y1, x2, y2) {
  return d3.line()(
    [
      [x1, y1],
      [(x1 + x2) / 2, (y1 + y2) / 2],
      [x2, y2],
    ]
  )
}

export function generatePartialPath(x1, y1, x2, y2, fraction) {
  return generatePath(x1, y1, x1 + (x2 - x1) * fraction, y1 + (y2 - y1) * fraction)
}

export function generatePathFromEdge(edge, nodes) {
  const x1 = nodes[edge.start].x,
        y1 = nodes[edge.start].y,
        x2 = nodes[edge.end].x,
        y2 = nodes[edge.end].y
  return generatePath(x1, y1, x2, y2)
}

export function appendSvgDefsD3(svg) {
  // direction marker
  svg.append("defs").append("marker")
    .attr("id", "triangle")
    .attr("refY", 1.75) // fudge factor to make svg scaling work
    .attr("markerWidth", 15)
    .attr("markerHeight", 15)
    .attr("orient", "auto")
    .append("path")
      .attr("d", "M 0 0 12 6 0 12 3 6")
      .style("fill", "black")
      .style("transform", "scale(0.3)")
}

// call this first
export function setUpSvg(svg) {
  appendSvgDefsD3(svg)
  svg.append("g").attr("class", "edges")
  svg.append("g").attr("class", "nodes")
}

export function renderNodesD3(svg, node_data, opts={}) {
  const defaultOpts = {
    onClick: () => {},
  }
  opts = {...defaultOpts, ...opts}

  let nodes = svg.select("g.nodes").selectAll("g.node")
    .data(node_data)

  let nodesEnter = nodes.enter().append("g")
    .attr("class", "node")
    .style("transform", (d) => `translate(${d.x}px,${d.y}px)`)

  nodesEnter.append("circle")
    .attr("r", 7)
    .on("mouseover", (_, i, elems) => d3.select(elems[i]).attr("fill", "green").attr("r", 9))
    .on("mouseout",  (_, i, elems) => d3.select(elems[i]).attr("fill", "black").attr("r", 7))
    .on("click", opts.onClick)

  // nodesEnter.append("text")
  //   .text((_, i) => i)
  //   .attr("x", 10)

  nodes.exit().remove()

  return nodes
}

// node data is passed because we need position
export function renderEdgesD3(svg, edge_data, node_data, opts={}) {
  const defaultOpts = {
    strokeFn: () => "grey",
  }
  opts = {...defaultOpts, ...opts}

  let edges = svg.select("g.edges").selectAll("g.edge")
    .data(edge_data)

  edges.enter().append("g")
    .attr("class", "edge")
    .append("path")
      .attr("d", (d) => generatePathFromEdge(d, node_data))
      .attr("stroke", opts.strokeFn)
      .attr("stroke-width", 5)
      .attr("marker-mid", "url(#triangle)")

  edges.exit().remove()

  return edges
}

///// ALGORITHMS /////

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
export function bfs(start, end, edges, nodes) {
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

export function highlightPath(path, onAnimationFinish = () => {}, transitionLength = 500, delayUnit = 100) {
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
