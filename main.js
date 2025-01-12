import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { initialColors, materials, Roll, stateMap } from "./3Dhelpers";
let scene, camera, renderer, controls, rollObject, group;
let moveQueue = [];
let isRotating = false;
const rotateConditions = {
  right: { axis: "x", value: 1 },
  left: { axis: "x", value: -1 },
  top: { axis: "y", value: 1 },
  bottom: { axis: "y", value: -1 },
  front: { axis: "z", value: 1 },
  back: { axis: "z", value: -1 },
};

const cPositions = [-1, 0, 1];
let cubes = [];

// setting the scene cameras and orbits
function init() {
  const { innerHeight, innerWidth } = window;
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000); // Darker background for better contrast

  renderer = new THREE.WebGLRenderer({ antialias: true });
  document.body.appendChild(renderer.domElement);

  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;

  camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 1, 1000);
  camera.position.set(6, 6, 6);
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; // Add smooth damping to controls
  controls.dampingFactor = 0.05;

  window.addEventListener("resize", onWindowResize, false);
  createObjects();
}

function onWindowResize() {
  const { innerWidth, innerHeight } = window;
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
}

function createObjects() {
  const geometry = new RoundedBoxGeometry(1, 1, 1, 1, 0.12);
  let index = 0;
  let createCube = (position) => {
    let mat = [];
    for (let i = 0; i < 6; i++) {
      if (stateMap[index][i]) {
        const values = stateMap[index][i];
        mat.push(materials[initialColors[values.position][values.no]]);
      } else {
        mat.push(materials.black);
      }
    }
    index++;
    const cube = new THREE.Mesh(geometry, mat);
    cube.position.set(position.x, position.y, position.z);
    cubes.push(cube);

    // Add beveled edges
    const edgesGeometry = new THREE.EdgesGeometry(geometry);
    const edgesMaterial = new THREE.LineBasicMaterial({
      color: 0x000000,
      linewidth: 1,
    }); // Black edges
    const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);

    cube.add(edges);
    scene.add(cube);
  };

  cPositions.forEach((x) => {
    cPositions.forEach((y) => {
      cPositions.forEach((z) => {
        createCube({ x, y, z });
      });
    });
  });

  group = new THREE.Group();
  scene.add(group);
}

async function processNextMove() {
  if (moveQueue.length === 0 || isRotating) return;

  isRotating = true;
  const move = moveQueue.shift();
  rollObject = new Roll(
    rotateConditions[move.position],
    move.direction,
    scene,
    group,
    cubes,
    Math.PI / 50
  );

  while (rollObject.active) {
    const finished = await rollObject.rollFace();
    if (finished) {
      rollObject = null;
      isRotating = false;
      // Process next move if available
      if (moveQueue.length > 0) {
        processNextMove();
      }
      break;
    }
    // Wait a frame
    await new Promise((resolve) => setTimeout(resolve, 16));
  }
}

export function moves(position, direction) {
  moveQueue.push({ position, direction });
  if (!isRotating) {
    processNextMove();
  }
}

function update() {
  controls.update();
}

function render() {
  requestAnimationFrame(render);
  update();
  renderer.render(scene, camera);
}
window.moves = moves;
init();
render();
