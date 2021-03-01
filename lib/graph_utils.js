import * as d3 from "d3"

// Assumptions:
//  - Graph representation has format:
//     nodes: [{x, y}]
//     edges: [{start, end}]
//  - SVG has hierarchy:
//    - svg
//      - g.edges
//        - g.edge
//          - path, text, etc.
//      - g.nodes
//        - g.node
//          - circle, text, etc.

// TODO: these functions should probably all take objects as params

///// RENDERING /////

// call this first
export function setUpSvg(svg) {
  if (svg.select("defs").size() === 0) appendSvgDefsD3(svg)
  if (svg.select("g.edges").size() === 0) svg.append("g").attr("class", "edges")
  if (svg.select("g.nodes").size() === 0) svg.append("g").attr("class", "nodes")
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

// TODO:
//  - need to apply same things to update and enter groups
export function renderNodesD3({ svg, nodeData, opts }) {
  const defaultOpts = {
    onClick: () => {},
    radius: 7,
    mouseoverRadius: 9,
    textFn: (_, i) => i,
    fill: "black",
  }
  opts = {...defaultOpts, ...opts}

  let nodes = svg.select("g.nodes").selectAll("g.node")
    .data(nodeData)

  let nodesEnter = nodes.enter().append("g")
    .attr("class", "node")

  nodesEnter.append("circle")
    .attr("r", opts.radius)

  nodes.merge(nodesEnter)
    .style("transform", (d) => `translate(${d.x}px,${d.y}px)`)
    .select("circle")
      .style("fill", opts.fill)
      .on("mouseover", (e) => d3.select(e.target).style("fill", "green").attr("r", opts.mouseoverRadius))
      .on("mouseout",  (e) => d3.select(e.target).style("fill", "black").attr("r", opts.radius))
      .on("click", opts.onClick)

  // nodesEnter.append("text")
  //   .text(opts.textFn)
  //   .attr("x", 10)

  nodes.exit().remove()

  return nodes
}

// node data is passed because we need position
export function renderEdgesD3({ svg, edgeData, nodeData, directed, opts }) {
  const defaultOpts = {
    strokeFn: () => "grey",
    strokeWidth: 5,
  }
  opts = {...defaultOpts, ...opts}

  let edges = svg.select("g.edges").selectAll("g.edge")
    .data(edgeData)

  let enter = edges.enter().append("g")
    .attr("class", "edge")

  enter.append("path")

  edges.merge(enter).select("path")
    .attr("d", (d) => generatePathFromEdge(d, nodeData))
    .attr("stroke", opts.strokeFn)
    .attr("stroke-width", opts.strokeWidth)

  if (directed) enter.attr("marker-mid", "url(#triangle)")

  edges.exit().remove()

  return edges
}


///// HELPERS /////

export function scaleNodeData(nodes, svgWidth, svgHeight) {
  return nodes.map(({ x, y }) => ({ x: x*svgWidth, y: y*svgHeight }))
}

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
