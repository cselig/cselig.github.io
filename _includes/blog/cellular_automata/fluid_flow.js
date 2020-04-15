let svg = d3.select("#fluid-flow svg")
  .attr("height", 430)
  .attr("width", 430);

let frame = svg.append("g")
  .style("transform", "translate(15px,15px)");

// 0 <= t <= 1
const color = (t) => d3.interpolateBlues(t);

// grid size
let X = 20,
    Y = 20;
// length of one side of a square cell
let cellSize = 20
let xscale = d3.scaleLinear()
  .domain([0, X])
  .range([0, X * cellSize]);
let yscale = d3.scaleLinear()
  .domain([0, Y])
  .range([0, Y * cellSize]);

let interval = 200;

// "x:y" => pressure (float)
let cells;

const draw = () => {
  data = allCells(cells);
  squares = frame.selectAll("rect").data(data, ([x, y]) => `${x}:${y}`);

  squares.enter().append("rect")
    .attr("x", ([x, y]) => xscale(x))
    .attr("y", ([x, y]) => yscale(y))
    .attr("height", cellSize)
    .attr("width", cellSize)
    .merge(squares) // enter + update
      .transition().duration(interval)
        .attr("fill", ([x, y]) => color(cells.get(`${x}:${y}`)));
}

const tick = () => {
  let newCells = new Map();

  for (let x = 0; x < X; x++) {
    for (let y = 0; y < Y; y++) {
      let flow = 0;
      let thisPressure = cells.get(`${x}:${y}`);

      for (const otherPressure of neighbors([x, y], cells, X, Y)) {
        flow += otherPressure - thisPressure;
      }

      // include fudge factor for damping
      newCells.set(`${x}:${y}`, thisPressure + flow / 6);
    }
  }

  cells = newCells;
}

let i;
let intervalId;

const init = () => {
  i = 0;
  clearInterval(intervalId);
  cells = new Map();

  for (let x = 0; x < X; x++) {
    for (let y = 0; y < Y; y++) {
      let pressure =  (Math.pow(x, 3) + Math.pow(y, 3)) / (Math.pow(X - 1, 3) + Math.pow(Y - 1, 3));
      cells.set(`${x}:${y}`, pressure);
    }
  }

  draw(allCells(cells));
}

const startGame = () => {
  intervalId = setInterval(
    () => {
      tick();
      draw();
      i++;
      if (i >= 200) {
        console.log("stopping fluid flow");
        clearInterval(intervalId);
      }
    },
    interval,
  );
}

$("#fluid-flow button[name=start]").click(() => {
  init();
  startGame();
});

init();