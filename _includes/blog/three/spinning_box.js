let container = document.getElementById("spinning-box-container"),
    bbox = container.getBoundingClientRect();

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, bbox.width/bbox.height, 0.1, 1000);

let renderer = new THREE.WebGLRenderer();
renderer.setClearColor (0xffffff, 1);

renderer.setSize(bbox.width, bbox.height);
container.appendChild(renderer.domElement);

let cubeGeo = new THREE.BoxGeometry(2, 2, 2),
    cubeMaterial = new THREE.MeshBasicMaterial({color: 0x3182bd}),
    cube = new THREE.Mesh(cubeGeo, cubeMaterial);
scene.add(cube);

let edgeGeo = new THREE.EdgesGeometry(cubeGeo),
    edgeMaterial = new THREE.LineBasicMaterial({color: 0x000000, linewidth: 2}),
    edges = new THREE.LineSegments(edgeGeo, edgeMaterial);
cube.add(edges);

camera.position.z = 5;
cube.rotation.x = 1;
cube.rotation.y = 1;

const animate = function () {
	requestAnimationFrame(animate);

	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;

	renderer.render(scene, camera);
};

animate();