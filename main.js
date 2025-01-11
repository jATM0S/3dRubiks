import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

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

const colorConditions = [
  ["x", 1, "green"],
  ["x", -1, "orange"],
  ["y", 1, "red"],
  ["y", -1, "yellow"],
  ["z", 1, "blue"],
  ["z", -1, "white"],
];

const step = Math.PI / 50;
const faces = ["front", "back", "left", "right", "top", "bottom"];
const directions = [-1, 1];
const cPositions = [-1, 0, 1];
let cubes = [];

const materials = {
  blue: new THREE.MeshPhysicalMaterial({
    emissive: 0x0051ba,
    metalness: 0.9,
  }),
  red: new THREE.MeshPhysicalMaterial({
    emissive: 0xc41e3a,
    metalness: 0.9,
  }),
  white: new THREE.MeshPhysicalMaterial({
    emissive: 0xffffff,
    metalness: 0.9,
  }),
  green: new THREE.MeshPhysicalMaterial({
    emissive: 0x009b48,
    metalness: 0.9,
  }),
  yellow: new THREE.MeshPhysicalMaterial({
    emissive: 0xffd500,
    metalness: 0.9,
  }),
  orange: new THREE.MeshPhysicalMaterial({
    emissive: 0xff5800,
    metalness: 0.9,
  }),
  black: new THREE.MeshPhysicalMaterial({
    emissive: 0x1a1a1a,
    metalness: 0.9,
  }),
};

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

class Roll {
  constructor(face, direction) {
    this.face = face;
    this.stepCount = 0;
    this.active = true;
    this.direction = direction;
    this.init();
  }

  init() {
    cubes.forEach((item) => {
      if (item.position[this.face.axis] == this.face.value) {
        scene.remove(item);
        group.add(item);
      }
    });
  }

  rollFace() {
    return new Promise((resolve) => {
      if (this.stepCount != 25) {
        group.rotation[this.face.axis] += this.direction * step;
        this.stepCount += 1;
        resolve(false); // Not finished
      } else {
        if (this.active) {
          this.active = false;
          this.clearGroup();
        }
        resolve(true); // Finished
      }
    });
  }

  clearGroup() {
    for (var i = group.children.length - 1; i >= 0; i--) {
      let item = group.children[i];
      item.getWorldPosition(item.position);
      item.getWorldQuaternion(item.rotation);
      item.position.x = Math.round(item.position.x);
      item.position.y = Math.round(item.position.y);
      item.position.z = Math.round(item.position.z);
      group.remove(item);
      scene.add(item);
    }
    group.rotation[this.face.axis] = 0;
  }
}
function createObjects() {
  const geometry = new RoundedBoxGeometry(1, 1, 1, 1, 0.12);

  let createCube = (position) => {
    let mat = [];
    for (let i = 0; i < 6; i++) {
      let cnd = colorConditions[i];
      if (position[cnd[0]] == cnd[1]) {
        mat.push(materials[cnd[2]]);
      } else {
        mat.push(materials.black);
      }
    }
    const cube = new THREE.Mesh(geometry, mat);
    cube.position.set(position.x, position.y, position.z);
    cube.castShadow = true;
    cube.receiveShadow = true;
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
  rollObject = new Roll(rotateConditions[move.position], move.direction);

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
