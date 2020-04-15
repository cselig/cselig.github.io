// get a list of [x, y] neighbors of a cell
const neighbors = ([x, y], cells, X, Y) => {
  diffs = [
    [-1, 0],
    [-1, -1],
    [0, -1],
    [1, -1],
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
  ]
  result = [];
  for ([dx, dy] of diffs) {
    if (x + dx >= 0 && y + dy >= 0 && x + dx < X && y + dy < Y) {
      result.push(cells.get(`${x + dx}:${y + dy}`));
    }
  }
  return result;
}

const allCells = (cells) => {
  result = []
  for (let [pos, state] of cells) {
    result.push(pos.split(":"));
  }
  return result;
}

const drawGrid = (frame, cells, xscale, yscale, cellSize) => {
  frame.selectAll("rect.grid")
    .data(allCells(cells))
    .enter().append("rect")
      .attr("class", "grid")
      .attr("fill", "none")
      .attr("stroke", "lightgrey")
      .attr("x", ([x, y]) => xscale(x) - cellSize / 2)
      .attr("y", ([x, y]) => yscale(y) - cellSize / 2)
      .attr("height", cellSize)
      .attr("width", cellSize);
}