let svg = d3.select("#game-of-life svg")
  .attr("height", 420)
  .attr("width", 410);

let frame = svg.append("g")
  .style("transform", "translate(10px,20px)");

// grid size
let X = 20,
    Y = 20;
// length of one side of a square cell
let cellSize = 20;
let xscale = d3.scaleLinear()
  .domain([0, X])
  .range([0, X * cellSize]);
let yscale = d3.scaleLinear()
  .domain([0, Y])
  .range([0, Y * cellSize]);

let interval = 500; // ms

let cells;

const aliveCells = (cells) => {
  result = []
  for (let [pos, state] of cells) {
    if (state === "alive") {
      result.push(pos.split(":"));
    }
  }
  return result;
}

// draw game state
const draw = (data) => {
  circles = frame.selectAll("circle").data(data, ([x, y]) => `${x}:${y}`);

  circles.enter().append("circle")
    .attr("fill", "green")
    .attr("stroke", "none")
    .attr("r", 0)
    .attr("cx", ([x, y]) => xscale(x))
    .attr("cy", ([x, y]) => yscale(y))
    .transition().duration(interval / 2)
      .attr("r", cellSize / 2 - 1);

  circles.attr("fill", "grey");

  circles.exit()
    .attr("fill", "red")
    .transition().duration(interval / 2)
      .attr("r", 0)
    .remove();
}

// advance game state
const tick = () => {
  let newCells = new Map();

  // calculate new states
  for (let x = 0; x < X; x++) {
    for (let y = 0; y < Y; y++) {
      let aliveNeighbors = 0;
      for (const neighborState of neighbors([x, y], cells, X, Y)) {
        aliveNeighbors += (neighborState === "alive") ? 1 : 0;
      }
      // Any live cell with two or three live neighbors survives.
      // Any dead cell with three live neighbors becomes a live cell.
      // All other live cells die in the next generation. Similarly, all other dead cells stay dead.
      let nextState;
      let currState = cells.get(`${x}:${y}`);
      if (currState === "alive" && (aliveNeighbors === 2 || aliveNeighbors === 3)) {
        nextState = "alive";
      } else if (currState === "dead" && aliveNeighbors === 3) {
        nextState = "alive";
      } else {
        nextState = "dead";
      }
      newCells.set(`${x}:${y}`, nextState);
    }
  }

  // advance state
  cells = newCells;
}

let i;
let intervalId;

const init = () => {
  i = 0;
  clearInterval(intervalId);
  // cells are strings "x:y" in this map, arrays [x, y] elsewhere
  cells = new Map();

  let initialState = [
    // glider
    [1, 0],
    [2, 1],
    [2, 2],
    [1, 2],
    [0, 2],

    // blinker
    [14, 4],
    [15, 4],
    [16, 4],
  ]
  let initialCells = new Set();
  for (const [x, y] of initialState) {
    initialCells.add(`${x}:${y}`);
  }

  for (let x = 0; x < X; x++) {
    for (let y = 0; y < Y; y++) {
      let repr = `${x}:${y}`;
      cells.set(repr, (initialCells.has(repr)) ? "alive" : "dead");
    }
  }

  draw(aliveCells(cells));
}

const startGame = () => {
  intervalId = setInterval(
    () => {
      tick();
      draw(aliveCells(cells));
      i++;
      if (i >= 100) {
        console.log("stopping game of life");
        clearInterval(intervalId);
      }
    },
    interval,
  );
}

$("#game-of-life button[name=start]").click(() => {
  setTimeout(() => {
      init();
      startGame();
    }),
    interval;
});

init();
drawGrid(frame, cells, xscale, yscale, cellSize);