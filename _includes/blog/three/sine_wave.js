let container = document.getElementById("sine-wave-container"),
    bbox = container.getBoundingClientRect();

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, bbox.width/bbox.height, 0.1, 1000);

let renderer = new THREE.WebGLRenderer();
renderer.setClearColor (0xffffff, 1);

renderer.setSize(bbox.width, bbox.height);
container.appendChild(renderer.domElement);

const xStart = -3,
      nCubes = 7;

let cubes = [];
let edges = [];
for (let i = 0; i < nCubes; i += 1) {
  let x = xStart + i;
  let cubeGeo = new THREE.BoxGeometry(1, 1, 1),
      cubeMaterial = new THREE.MeshBasicMaterial({color: 0x3182bd}),
      cube = new THREE.Mesh(cubeGeo, cubeMaterial);
  cube.position.x = x;
  cube.position.y = 0.5;
  cube.index = x + 3;

  cubes.push(cube);
  scene.add(cube);

  let edgeGeo = new THREE.EdgesGeometry(cube.geometry),
      edgeMaterial = new THREE.LineBasicMaterial({color: 0x000000, linewidth: 2}),
      edge = new THREE.LineSegments(edgeGeo, edgeMaterial);
  edges.push(edge)
  cube.add(edge);
}

camera.position.z = 5;
camera.position.y = 4;
camera.position.x = 2;
camera.lookAt(0, 0, 0);

renderer.render(scene, camera);

let t = 0;

const animate = function() {
  requestAnimationFrame(animate);
  for (let i = 0; i < cubes.length; i++) {
    let cube = cubes[i];
        edge = edges[i];
    let height = 1 + Math.sin(0.05 * t + Math.PI / nCubes * cube.index);
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

animate();