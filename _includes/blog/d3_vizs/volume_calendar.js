let svg = d3.select("#volume-calendar svg")

let cell_width = 32;
let cell_height = 32;
let width = 7 * cell_width; // 7 days a week
let height = 4 * cell_height; // display 4 weeks
let calendar_top_x = 50;
let calendar_top_y = 35;

let arr_sum = (arr) => arr.reduce((a,b) => a + b, 0);

let data = [
  [0, 4, 0, 5, 0, 0, 3],
  [0, 6, 7, 4, 0, 0, 2],
  [3, 0, 0, 4, 0, 2, 0],
  [0, 4, 4, 0, 6, 0, 0],
]
let daily_max = d3.max(data.map((arr) => d3.max(arr)));
let weekly_max = d3.max(data.map((arr) => arr_sum(arr)));

let x_scale = d3.scaleLinear()
  .domain([0, 7])
  .range([0, width]);
let y_scale = d3.scaleLinear()
  .domain([0, 4])
  .range([0, height]);
let r_scale = d3.scaleSqrt()
  .domain([0, daily_max])
  .range([0, 8]);
let bar_scale = d3.scaleLinear()
  .domain([0, weekly_max])
  .range([0, 150]);

let day_names = ["M", "T", "W", "T", "F", "S", "S"]

const renderRow = function(d) {
  let day_cell = d3.select(this).selectAll("g.day")
    .data(d)
    .enter().append("g")
      .attr("class", "day")
      .style("transform", (d, i) => "translate(" + x_scale(i) + "px,0)");
  // make uniformly sized area to capture mouseover
  day_cell.append("rect")
    .attr("class", "event-capture")
    .attr("fill", "none")
    .attr("stroke", "none")
    .style("pointer-events", "all")
    .style("x", -cell_width / 2)
    .style("y", -cell_height / 2)
    .style("width", cell_width)
    .style("height", cell_height)
    .on("mouseover", handleMouseover)
    .on("mouseout", handleMouseout);
  day_cell.append("circle")
    .style("shape-rendering", "geometricPrecision")
    .style("pointer-events", "none")
    .attr("r", (d) => (d == 0) ? 1 : r_scale(d))
    .attr("fill", (d) => (d == 0) ? "#a1a1aa" : "black");
  day_cell.append("text")
    .style("pointer-events", "none")
    .attr("x", -5)
    .attr("y", 6)
    .style("opacity", 0)
    .style("font-weight", 500)
    .text((d) => (d == 0) ? "" : d);
}

const handleMouseover = function(d) {
  if (d > 0) {
    let g = d3.select(this.parentNode);
    opacityTransition(g.select("circle"), 0);
    opacityTransition(g.select("text"), 1);
  }
}

const handleMouseout = function(d) {
  if (d > 0) {
    let g = d3.select(this.parentNode);
    opacityTransition(g.select("circle"), 1);
    opacityTransition(g.select("text"), 0);
  }
}

const opacityTransition = function(d3_node, opacity) {
  d3_node.transition()
    .style("opacity", opacity)
    .duration(300);
}


let frame = svg.append("g")
  .style("transform", "translate(" + calendar_top_x + "px," + calendar_top_y + "px)");

let calendar = frame.append("g")
  .attr("class", "calendar")

// draw calendar week rows
let rows = calendar.selectAll("g.row")
  .data(data)
  .enter().append("g")
    .attr("class", "row")
    .style("transform", (d, i) => "translate(0," + y_scale(i + 1) + "px)")
  .each(renderRow);

// display weekday names above calendar
frame.append("g")
  .attr("class", "header")
  .selectAll(".day-label")
    .data(day_names)
    .enter().append("text")
      .attr("class", "day-label")
      .style("font-size", 15)
      .attr("fill", "#212529")
      .text((d) => d)
      // include fudge factor to make text line up
      .attr("x", (d, i) => x_scale(i) - 4);

// draw bar chart for weekly volume
let weekly_volumes = frame.append("g")
  .attr("class", "weekly_volumes")
  .style("transform", "translate(" + (cell_width * 7) + "px," + cell_height + "px)");

let weekly_row = weekly_volumes.selectAll("g.row")
  .data(data)
  .enter().append("g")
    .attr("class", "row")
    .style("transform", (d, i) => "translate(" + (-cell_width / 3) + "px," + (y_scale(i) - cell_height / 4) + "px)")

weekly_row.append("rect")
  .attr("fill", "darkgray")
  .attr("stroke", "black")
  .style("width", (d) => bar_scale(arr_sum(d)))
  .style("height", cell_height / 2);

weekly_row.append("text")
  .text((d) => arr_sum(d) + "mi")
  .attr("fill", "#212529")
  .attr("x", (d) => bar_scale(arr_sum(d)) + 7)
  .attr("y", 13);