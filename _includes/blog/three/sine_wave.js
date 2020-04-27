let container = document.getElementById("sine-wave-container"),
    bbox = container.getBoundingClientRect();

let scene, camera;

let renderer = new THREE.WebGLRenderer();
renderer.setClearColor (0xffffff, 1);

renderer.setSize(bbox.width, bbox.height);
container.appendChild(renderer.domElement);

const R = 3, // radius
      MIN_HEIGHT = 1,
      AMPLITUDE = 1,
      TAU = 2 * Math.PI;

let FREQUENCY,
    N; // number of cubes

const get_selector = function(name) {
  return $(`#sine-wave-container input[name=${name}]`);
}

const set_inputs = function() {
  // input range default is [0, 100]
  const frequency_input = get_selector("frequency")[0].value;
  const [frequency_min, frequency_max] = [0.01, 0.15];
  FREQUENCY = frequency_input / 100 * (frequency_max - frequency_min) + frequency_min;

  N = get_selector("ncubes")[0].value;
}

let cubes, edges;

// returns [x, z] coordinates for ith rectangle
const coordinates = function(i) {
  let theta = TAU / N * i;
  return [R * Math.cos(theta), R * Math.sin(theta)];
}

const init = function() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, bbox.width/bbox.height, 0.1, 1000);

  cubes = [];
  edges = [];

  for (let i = 0; i < N; i++) {
    const [x, z] = coordinates(i);

    let cubeGeo = new THREE.BoxGeometry(1, 1, 1),
        cubeMaterial = new THREE.MeshBasicMaterial({color: 0x3182bd}),
        cube = new THREE.Mesh(cubeGeo, cubeMaterial);

    cube.position.x = x;
    cube.position.z = z;

    scene.add(cube);
    cubes.push(cube);

    let edgeGeo = new THREE.EdgesGeometry(cube.geometry),
        edgeMaterial = new THREE.LineBasicMaterial({color: 0x000000}),
        edge = new THREE.LineSegments(edgeGeo, edgeMaterial);

    cube.add(edge);
    edges.push(edge);
  }

  camera.position.z = R * 2;
  camera.position.y = MIN_HEIGHT + AMPLITUDE * 4;
  camera.position.x = 2;
  camera.lookAt(0, 0, 0);
}

let t = 0;

const animate = function() {
  requestAnimationFrame(animate);

  for (let i = 0; i < N; i++) {
    let cube = cubes[i];
    let edge = edges[i];

    let height = MIN_HEIGHT + AMPLITUDE + AMPLITUDE * Math.sin(FREQUENCY * t + TAU / N * i);
    let newGeo = new THREE.CubeGeometry(1, height, 1);
    cube.position.y = height / 2;

    cube.geometry.dispose();
    cube.geometry = newGeo;

    edge.geometry.dispose();
    edge.geometry = newGeo;
  }

  renderer.render(scene, camera);
  t++;
}

get_selector("frequency").change(() => {
  set_inputs();
  init();
});

get_selector("ncubes").change(() => {
  set_inputs();
  init();
})

set_inputs();
init();
animate();