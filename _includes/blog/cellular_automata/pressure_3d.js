// adapted from https://bl.ocks.org/niekes/613d43d39372f99ae2dcea14f0f90617
const dragStart = function() {
  mx = d3.event.x;
  my = d3.event.y;
}

const dragged = function() {
  mouseX = mouseX || 0;
  mouseY = mouseY || 0;
  beta   = (d3.event.x - mx + mouseX) * Math.PI / 230 ;
  alpha  = (d3.event.y - my + mouseY) * Math.PI / 230  * (-1);
  draw(cubes3D.rotateY(beta + startAngle).rotateX(alpha - startAngle)(cubes), 0);
}

const dragEnd = function() {
  mouseX = d3.event.x - mx + mouseX;
  mouseY = d3.event.y - my + mouseY;
}

let origin = [480, 300],
  scale = 20,
  j = 10,
  cubes = [],
  alpha = 0,
  beta = 0,
  startAngle = Math.PI/6,
  interval = 400;
let svg = d3.select('#pressure-3d svg')
  .attr("width", 960)
  .attr("height", 500)
  .call(d3.drag()
    .on('drag', dragged)
    .on('start', dragStart).on('end', dragEnd))
  .append('g');
const color = function(t) { return d3.interpolateBlues(t) };
let cubesGroup = svg.append('g').attr('class', 'cubes');
let mx, my, mouseX, mouseY;

let cubes3D = d3._3d()
  .shape('CUBE')
  .x(function(d){ return d.x; })
  .y(function(d){ return d.y; })
  .z(function(d){ return d.z; })
  .rotateY( startAngle)
  .rotateX(-startAngle)
  .origin(origin)
  .scale(scale);

const draw = function(data) {
  // cubes
  var cubes = cubesGroup.selectAll('g.cube')
    .data(data, function(d){ return d.id });

  var ce = cubes
    .enter()
    .append('g')
    .attr('class', 'cube')
    .merge(cubes)
  ce.transition().ease(d3.easeLinear).duration(interval)
    .attr('fill', (d) => color(d.height / -7))
    .attr('stroke', (d) => d3.color(color(d.height / -7)).darker(1));
  ce.sort(cubes3D.sort)

  cubes.exit().remove();

  // faces
  var faces = cubes.merge(ce)
    .selectAll('path.face')
    .data(function(d){ return d.faces; }, function(d){ return d.face; });

  faces.enter()
    .append('path')
    .attr('class', 'face')
    .attr('fill-opacity', 0.95)
    .classed('_3d', true)
    .merge(faces)
    .transition().ease(d3.easeLinear).duration(interval)
      .attr('d', cubes3D.draw);

  faces.exit().remove()

  // sort
  ce.selectAll('._3d').sort(d3._3d().sort);
}

// get a list of [z, x] neighbors of a cell
const neighbors = ([z, x]) => {
  let diffs = [
    [-2, 0],
    [0, -2],
    [2, 0],
    [0, 2],
  ];
  let result = [];
  for ([dz, dx] of diffs) {
    if (z + dz >= -j && x + dx >= -j && z + dz <= j && x + dx <= j) {
      result.push(state.get(`${z + dz}:${x + dx}`));
    }
  }
  return result;
}

const makeCube = function(h, x, z) {
  return [
    {x: x - 1, y: h, z: z + 1}, // FRONT TOP LEFT
    {x: x - 1, y: 0, z: z + 1}, // FRONT BOTTOM LEFT
    {x: x + 1, y: 0, z: z + 1}, // FRONT BOTTOM RIGHT
    {x: x + 1, y: h, z: z + 1}, // FRONT TOP RIGHT
    {x: x - 1, y: h, z: z - 1}, // BACK  TOP LEFT
    {x: x - 1, y: 0, z: z - 1}, // BACK  BOTTOM LEFT
    {x: x + 1, y: 0, z: z - 1}, // BACK  BOTTOM RIGHT
    {x: x + 1, y: h, z: z - 1}, // BACK  TOP RIGHT
  ];
}

// "z:x" => pressure
let state;

const tick = function() {
  let newState = new Map();
  cubes = [];

  for (let z = -j; z <= j; z = z + 2) {
    for (let x = -j; x <= j; x = x + 2) {
      key = `${z}:${x}`;
      let flow = 0;
      let thisPressure = state.get(key);

      for (const otherPressure of neighbors([z, x])) {
        flow += otherPressure - thisPressure;
      }

      let newP = thisPressure + flow / 4;
      let newH = newP * -7;

      newState.set(key, newP);

      let _cube = makeCube(newH, x, z);
          _cube.id = key;
          _cube.height = newH;
          cubes.push(_cube);
    }
  }

  state = newState;
}

let i;
let intervalId;

const init = function() {
  i = 0;
  clearInterval(intervalId);

  cubes = [];
  state = new Map();

  for (let z = -j; z <= j; z = z + 2) {
    for (let x = -j; x <= j; x = x + 2) {
      let key = `${z}:${x}`;
      let p = (Math.pow(x, 2) + Math.pow(z, 2)) / (2 * Math.pow(j - 1, 2));
      let h = p * -7 // scaling
      state.set(key, p)
      let _cube = makeCube(h, x, z);
          _cube.id = key;
          _cube.height = h;
          cubes.push(_cube);
    }
  }
  draw(cubes3D(cubes));
}

let first = true;

const startGame = () => {
  first = false;
  intervalId = setInterval(
    () => {
      tick();
      draw(cubes3D(cubes));
      if (i++ >= 40) {
        console.log("stopping 3D fluid flow");
        clearInterval(intervalId);
      }
    },
    interval,
  );
}

$("#pressure-3d button[name=start]").click(() => {
  init();
  setTimeout(
    () => startGame(),
    first ? 0: interval,
  );
});

init();