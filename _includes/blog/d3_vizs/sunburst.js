let height = width = 300;
let radius = 80;
let transitionDuration = 300;
let colors = d3["schemeCategory20c"];

let arr_sum = (arr) => arr.reduce((a,b) => a + b, 0);

let svg = d3.select("#sunburst-chart svg")
  .attr("width", width)
  .attr("height", height);

let pie = d3.pie().sort(null);

let data = [
  [1, 1],
  [3, 1, 2],
  [4, 2, 1, 2],
  [1, 3],
];

const calcGroup = (ind) => {
  let bins = data.map((arr) => arr.length);
  for (i = 1; i < bins.length; i++) {
    bins[i] = bins[i - 1] + bins[i];
  }
  for (const [i, x] of bins.entries()) {
    if (ind < x) {
      return i;
    }
  }
}

let arcOuter = d3.arc()
  .innerRadius(0)
  .outerRadius(radius);
let largeArcOuter = d3.arc()
  .innerRadius(0)
  .outerRadius(radius * 1.5)

const transitionArcGroup = (ind, newArc) => {
  svg.selectAll(".outer .group" + ind).transition()
    .delay(100)
    .duration(transitionDuration)
    .attr("d", newArc);
}

// draw outer pie first so it can hide under the inner one
let gOuter = svg.append("g")
  .attr("class", "outer")
  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

let outerData = data.reduce((arr1, arr2) => arr1.concat(arr2));

let arcsOuter = gOuter.selectAll("arc")
  .data(pie(outerData))
  .enter().append("g")
    .attr("class", "arc");

arcsOuter.append("path")
  .attr("class", (d, i) => "group" + calcGroup(i))
  .attr("fill", (d, i) => colors[calcGroup(i) * 4 + i % 4])
  .attr("stroke-width", 2)
  .style("opacity", 0.8)
  .attr("d", arcOuter)
  .on("mouseover", (d, i, nodes) => {
    d3.select(nodes[i])
      .attr("stroke", "black")
      .style("opacity", 1);
    // include arc group transition handler here as well as on the
    // inner sections so we can mouseover the expanded sections
    transitionArcGroup(calcGroup(i), largeArcOuter);
  })
  .on("mouseout", (d, i, nodes) => {
    d3.select(nodes[i])
      .attr("stroke", "none")
      .style("opacity", 0.8);
    transitionArcGroup(calcGroup(i), arcOuter);
  });

// inner pie
let dataInner = data.map(arr_sum);

let gInner = svg.append("g")
  .attr("class", "inner")
  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

let arcInner = d3.arc()
  .innerRadius(0)
  .outerRadius(radius);

let arcsInner = gInner.selectAll("arc")
  .data(pie(dataInner))
  .enter().append("g")
    .attr("class", "arc");

arcsInner.append("path")
  .attr("class", (d, i) => "group" + i)
  .attr("fill", (d, i) => colors[i * 4])
  .attr("d", arcInner)
  .on("mouseover", (d, i) => transitionArcGroup(i, largeArcOuter))
  .on("mouseout", (d, i) => transitionArcGroup(i, arcOuter));