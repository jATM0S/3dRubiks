import * as THREE from "three";

export const materials = {
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
export const initialColors = {
  front: [
    "red",
    "blue",
    "green",
    "yellow",
    "white",
    "orange",
    "blue",
    "red",
    "green",
  ],
  back: [
    "yellow",
    "green",
    "blue",
    "orange",
    "red",
    "white",
    "green",
    "blue",
    "yellow",
  ],
  left: [
    "blue",
    "yellow",
    "red",
    "green",
    "orange",
    "white",
    "red",
    "yellow",
    "blue",
  ],
  right: [
    "white",
    "orange",
    "yellow",
    "blue",
    "red",
    "green",
    "orange",
    "yellow",
    "red",
  ],
  top: [
    "green",
    "red",
    "orange",
    "yellow",
    "blue",
    "white",
    "yellow",
    "green",
    "red",
  ],
  bottom: [
    "orange",
    "blue",
    "white",
    "red",
    "yellow",
    "green",
    "blue",
    "orange",
    "white",
  ],
};
export const stateMap = {
  0: {
    1: { position: "left", no: 7 },
    3: { position: "left", no: 7 },
    5: { position: "left", no: 7 },
  },
  1: {
    1: { position: "left", no: 7 },
    3: { position: "left", no: 7 },
  },
  2: {
    1: { position: "left", no: 7 },
    3: { position: "left", no: 7 },
    4: { position: "left", no: 7 },
  },
  3: {
    1: { position: "left", no: 7 },
    5: { position: "left", no: 7 },
  },
  4: {
    1: { position: "left", no: 7 },
  },
  5: {
    1: { position: "left", no: 7 },
    4: { position: "left", no: 7 },
  },
  6: {
    1: { position: "left", no: 7 },
    2: { position: "left", no: 7 },
    5: { position: "left", no: 7 },
  },
  7: {
    1: { position: "left", no: 7 },
    2: { position: "left", no: 7 },
  },
  8: {
    1: { position: "left", no: 7 },
    2: { position: "left", no: 7 },
    4: { position: "left", no: 7 },
  },
  9: {
    3: { position: "left", no: 7 },
    5: { position: "left", no: 7 },
  },
  10: {
    3: { position: "left", no: 7 },
  },
  11: {
    3: { position: "left", no: 7 },
    4: { position: "left", no: 7 },
  },
  12: {
    5: { position: "left", no: 7 },
  },
  13: {},
  14: {
    4: { position: "left", no: 7 },
  },
  15: {
    2: { position: "left", no: 7 },
    5: { position: "left", no: 7 },
  },
  16: {
    2: { position: "left", no: 7 },
  },
  17: {
    2: { position: "left", no: 7 },
    4: { position: "left", no: 7 },
  },
  18: {
    0: { position: "left", no: 7 },
    3: { position: "left", no: 7 },
    5: { position: "left", no: 7 },
  },
  19: {
    0: { position: "left", no: 7 },
    3: { position: "left", no: 7 },
  },
  20: {
    0: { position: "left", no: 7 },
    3: { position: "left", no: 7 },
    4: { position: "left", no: 7 },
  },
  21: {
    0: { position: "left", no: 7 },
    5: { position: "left", no: 7 },
  },
  22: {
    0: { position: "left", no: 7 },
  },
  23: {
    0: { position: "left", no: 7 },
    4: { position: "left", no: 7 },
  },
  24: {
    0: { position: "left", no: 7 },
    2: { position: "left", no: 7 },
    5: { position: "left", no: 7 },
  },
  25: {
    0: { position: "left", no: 7 },
    2: { position: "left", no: 7 },
  },
  26: {
    0: { position: "left", no: 7 },
    2: { position: "left", no: 7 },
    4: { position: "left", no: 7 },
  },
};

export class Roll {
  constructor(face, direction, scene, group, cubes, step) {
    this.face = face;
    this.stepCount = 0;
    this.active = true;
    this.direction = direction;
    this.scene = scene;
    this.group = group;
    this.cubes = cubes;
    this.step = step;
    this.init();
  }

  init() {
    this.cubes.forEach((item) => {
      if (item.position[this.face.axis] == this.face.value) {
        this.scene.remove(item);
        this.group.add(item);
      }
    });
  }

  rollFace() {
    return new Promise((resolve) => {
      if (this.stepCount != 25) {
        this.group.rotation[this.face.axis] += this.direction * this.step;
        this.stepCount += 1;
        resolve(false);
      } else {
        if (this.active) {
          this.active = false;
          this.clearGroup();
        }
        resolve(true);
      }
    });
  }

  clearGroup() {
    for (var i = this.group.children.length - 1; i >= 0; i--) {
      let item = this.group.children[i];
      item.getWorldPosition(item.position);
      item.getWorldQuaternion(item.rotation);
      item.position.x = Math.round(item.position.x);
      item.position.y = Math.round(item.position.y);
      item.position.z = Math.round(item.position.z);
      this.group.remove(item);
      this.scene.add(item);
    }
    this.group.rotation[this.face.axis] = 0;
  }
}
