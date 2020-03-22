let center_x = 100;
let center_y = 165;
let circleData = [50, 25, 15, 10];
let colors = d3["schemeCategory20c"];
let radius = d3.scaleSqrt()
  .domain([0, d3.max(circleData)])
  .range([0, 80]);

let svg = d3.select("#bubble-chart svg");

function handleMouseover(d, i) {
  d3.select(this).style("stroke", "black");
  svg.append("text")
    .attr("id", "tooltip")
    .attr("x", center_x - 65)
    .attr("y", center_y + 20)
    .text("Circle area: " + d);
}

function handleMouseout(d, i) {
  d3.select(this).style("stroke", "none");
  svg.select("#tooltip").remove();
}

svg.append("g")
  .selectAll("circle")
    .data(circleData)
  .enter().append("circle")
    .attr("cy", (d) => { return center_y - radius(d); })
    .attr("cx", center_x)
    .attr("r", radius)
    .style("fill", (d, i) => { return colors[i]; })
    .style("stroke-width", "3px")
    .on("mouseover", handleMouseover)
    .on("mouseout", handleMouseout);