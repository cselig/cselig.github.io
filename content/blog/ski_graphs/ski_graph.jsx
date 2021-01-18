import React from "react"
import * as d3 from "d3"

class SkiGraph extends React.Component {
  render() {
    return (
      <div id="ski-graph">
        <svg width="200" height="200"></svg>
      </div>
    )
  }

  componentDidMount() {
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
      }
    ]

    const edges_data = [
      {
        type: "lift",
        start: 0,
        end: 1
      },
      {
        type: "run",
        level: "blue",
        start: 1,
        end: 2,
      },
      {
        type: "run",
        level: "green",
        start: 2,
        end: 0
      }
    ]

    let svg = d3.select("#ski-graph svg")

    svg.append("defs").append("marker")
      .attr("id", "triangle")
      .attr("refX", 3)
      .attr("refY", 3)
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

    let edges = svg.selectAll("g.edge")
      .data(edges_data)
      .enter().append("g")
        .attr("class", "edge")

    nodes.append("circle")
      .attr("r", 10)
      .style("cx", (d) => d.x)
      .style("cy", (d) => d.y)

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

    edges.append("path")
      .attr("d", generatePath)
      .style("stroke-width", 3)
      .style("stroke", (d) => d.type === "lift" ? "grey" : d.level)
      .attr("marker-mid", "url(#triangle)")
  }
}

export default SkiGraph
