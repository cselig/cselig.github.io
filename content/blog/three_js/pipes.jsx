import React from "react"
import * as THREE from "three"

var $ = require("jquery")

class Pipes extends React.Component {
  render() {
    return (
      <div id="pipes-container" className="container">
        <button name="start">Start/Reset</button>
        <div style={{display: "flex", alignItems: "center"}}>
          <p>Rotate Camera:</p>
          <input type="checkbox" name="toggle-rotate"/>
        </div>
        <div className="canvas"></div>
      </div>
    )
  }

  componentDidMount() {
    let container = $("#pipes-container .canvas")[0],
    bbox = container.getBoundingClientRect();

    let scene, camera;

    let renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);

    renderer.setSize(bbox.width, bbox.height);
    container.appendChild(renderer.domElement);

    const SPEED = 3, // units/frame
          R = 1, // cylinder radius
          L = 80, // size of cube boundary
          RADIAL_SEGMENTS = 32,
          MAX_SEGMENTS = 70, // max segments per pipe
          MIN_LENGTH = 5, // min length of a pipe segment
          MAX_LENGTH = 20,
          CUBE_CENTER = [L/2, L/2, L/2];

    const initialPositions = [
      [L/2, 0, L/2],
      [3/4*L, 3/4*L, 0],
      [L/2, L, L/2],
    ];
    const colors = [
      0x3182bd, // blue
      0x229954, // green
      0xF08080, // coral
    ];
    const MAX_PIPES = colors.length;
    let materials = [];
    for (const color of colors) {
      materials.push(new THREE.MeshStandardMaterial({color: color}));
    }

    const bounds = new THREE.Box3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(L, L, L));

    // utils
    const randInt = function(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    }

    const randChoice = function(arr) {
      return arr[Math.floor(Math.random()*arr.length)];
    }

    const newDirection = function(old_dir, position) {
      // return a new direction vector such that:
      //   - new direction is orthogonal to old direction
      //   - a pipe going in new_direction with MAX_LENGTH will stay in bounds
      let validDirs = directions.filter((new_dir) => {
        return (vector_dot(old_dir, new_dir) === 0) &&
              willBeInBounds(new_dir, position)
      });
      return randChoice(validDirs);
    }

    const willBeInBounds = function(dir, position) {
      const end_position = vector_add(position, vector_scale(dir, MAX_LENGTH + 2));
      return bounds.containsPoint(new THREE.Vector3(...end_position));
    }

    // utility functions for working with vectors
    // could probably make this cleaner by not converting between
    // js lists and THREE.Vector3's
    const pos_to_vec = function(pos) {
      return [pos.x, pos.y, pos.z];
    }

    const vector_scale = function(v, s) {
      let result = [];
      for (let i = 0; i < v.length; i++) {
        result.push(v[i] * s);
      }
      return result;
    }

    const vector_add = function(v1, v2) {
      let result = [];
      for (let i = 0; i < v1.length; i++) {
        result.push(v1[i] + v2[i]);
      }
      return result;
    }

    const vector_dot = function(v1, v2) {
      let result = 0;
      for (let i = 0; i < v1.length; i++) {
        result += v1[i] * v2[i];
      }
      return result;
    }

    const createCylinder = function() {
      let geometry = new THREE.CylinderGeometry(R, R, 0, RADIAL_SEGMENTS);
      let material = materials[numPipes];
      let mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
      return mesh;
    }

    const createSphere = function() {
      let geometry = new THREE.SphereGeometry(R * 1.2, RADIAL_SEGMENTS, RADIAL_SEGMENTS);
      let material = new THREE.MeshStandardMaterial({color: colors[numPipes]});
      let mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
      return mesh;
    }

    const rotateCylinder = function(c) {
      if (Math.abs(c.direction[0]) === 1) {
        c.mesh.rotateZ(Math.PI / 2);
      } else if (Math.abs(c.direction[2]) === 1) {
        c.mesh.rotateX(Math.PI / 2);
      }
    }

    const computeCameraPos = function() {
      const x = L * 1.5 * Math.sin(theta);
      const y = L * 1.5 * (Math.cos(theta) + 1);
      return [x, L/2, y];
    }

    const updateCamera = function() {
      camera.position.set(...computeCameraPos())
      camera.lookAt(...CUBE_CENTER)
    }

    const directions = [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
      [-1, 0, 0],
      [0, -1, 0],
      [0, 0, -1],
    ]

    let numSegments; // number of pipe segments that have been created
    let numPipes; // number of pipes that have been created
    let c; // keeps track of the current cylinder segment
    let theta = 8; // current camera rotation
    let omega = 0.01; // rotational speed
    let rotateCamera = false;

    let animationRequestId;

    const animate = function() {
      animationRequestId = requestAnimationFrame(animate);

      if (c.length < c.max_length) {
        c.length += SPEED;
        c.mesh.geometry.dispose();
        c.mesh.geometry = new THREE.CylinderGeometry(R, R, c.length, RADIAL_SEGMENTS);
        // need to make sure cylinder only grows in one direction
        const old_pos = pos_to_vec(c.mesh.position);
        const new_pos = vector_add(old_pos, vector_scale(c.direction, SPEED/2));
        c.mesh.position.set(...new_pos);
      } else if (numSegments++ < MAX_SEGMENTS) {
        // new pipe segment
        const end_position = vector_add(pos_to_vec(c.mesh.position), vector_scale(c.direction, c.length/2));
        const old_pos = pos_to_vec(c.mesh.position);
        const new_pos = vector_add(old_pos, vector_scale(c.direction, c.length/2));
        c = {
          length: 0,
          direction: newDirection(c.direction, end_position),
          max_length: randInt(MIN_LENGTH, MAX_LENGTH),
          mesh: createCylinder(),
        }
        c.mesh.position.set(...new_pos);
        rotateCylinder(c);
        // create sphere at junction
        let sphere = createSphere();
        sphere.position.set(...new_pos);
      } else if (numPipes < MAX_PIPES) {
        // finish the old pipe with a sphere
        const position = vector_add(pos_to_vec(c.mesh.position), vector_scale(c.direction, c.length/2));
        let sphere = createSphere();
        sphere.position.set(...position);

        if (numPipes < MAX_PIPES - 1) {
          numPipes++;
          numSegments = 0;
          newPipe(initialPositions[numPipes]);
        } else {
          init();
        }
      }

      if (rotateCamera) {
        theta += omega;
        updateCamera();
      }

      renderer.render(scene, camera);
    }

    const newPipe = function(position) {
      c = {
        length: 0,
        direction: newDirection([0, 0, 0], position),
        max_length: randInt(3, 5),
        mesh: createCylinder(),
      };
      rotateCylinder(c);
      c.mesh.position.set(...position);

      let s = createSphere();
      s.position.set(...position);
    }

    const setScene = function() {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, bbox.width/bbox.height, 0.1, 1000);

      updateCamera();

      let light = new THREE.AmbientLight(0x404040, 3);
      scene.add(light);

      let pointLight = new THREE.PointLight(0x404040, 3, 0);
      pointLight.position.set(L, L, L);
      scene.add(pointLight);

      renderer.render(scene, camera);
    }

    const init = function() {
      setScene();

      numSegments = 0;
      numPipes = 0;

      newPipe(initialPositions[0]);

      cancelAnimationFrame(animationRequestId);

      animate();
    }

    setScene();

    $("#pipes-container button[name=start]").click(init);
    $("#pipes-container input[name=toggle-rotate").change(() => rotateCamera = !rotateCamera)
  }
}

export default Pipes
