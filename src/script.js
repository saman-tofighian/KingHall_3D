// Saman Tofighian
import gsap from "gsap";
import * as three from "three";
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const loader = document.querySelector(".loader");
const LoadingManager = new three.LoadingManager(
  () => {
    // بعد از بارگذاری کامل، مخفی کردن لودر
    gsap.to(loader, {
      opacity: 0,
      duration: 1,
      onComplete: () => {
        loader.style.display = "none";
      },
    });
  },
  (itemUrl, itemsLoaded, itemsTotal) => {
    console.log(`Loading: ${itemsLoaded} of ${itemsTotal}`);
  },
  (error) => {
    console.error("Error loading asset:", error);
  }
);

const Sc = new three.Scene();

const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// دوربین
const Camera = new three.PerspectiveCamera(35, size.width / size.height);
Camera.position.set(-1.7, 0, 9);
Camera.lookAt(1.7, 0, 8.7);
Sc.add(Camera);

// بوم WebGL
const canvas = document.getElementById("web");
const renderer = new three.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
});
renderer.setSize(size.width, size.height);
renderer.toneMapping = three.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.3;

let position = 0;
let model;
const draco = new DRACOLoader(LoadingManager);
draco.setDecoderPath("/draco/");
const gltf = new GLTFLoader(LoadingManager);
gltf.setDRACOLoader(draco);
gltf.load("/model/the_king_s_hall (3).glb", (hall) => {
  model = hall.scene;
  Sc.add(model);

  window.addEventListener("mouseup", () => {
    switch (position) {
      case 0:
        moveCamera(-1.8, 1.6, 5);
        rotateCamera(0, 0.1, 0);
        position = 1;
        break;

      case 1:
        moveCamera(2.8, 0, 3.6);
        rotateCamera(0, -2, 0);
        position = 2;
        break;

      case 2:
        moveCamera(2.5, -0.9, 12.2);
        rotateCamera(0.9, 0.6, -0.9);
        position = 3;
        break;

      case 3:
        moveCamera(2.7, 0.6, 3.7);
        rotateCamera(0.6, 1.9, -0.6);
        position = 4;
        break;

      case 4:
        moveCamera(1.7, 0, 8.7);
        rotateCamera(0, 4.7, 0);
        position = 5;
        break;

      case 5:
        moveCamera(0.5, 0.8, 10);
        rotateCamera(0.3, 1.65, -0.3);
        position = 0;
    }
  });

  function moveCamera(x, y, z) {
    gsap.to(Camera.position, {
      x,
      y,
      z,
      duration: 3,
    });
  }

  function rotateCamera(x, y, z) {
    gsap.to(Camera.rotation, {
      x,
      y,
      z,
      duration: 3.2,
    });
  }
});

// کنترل‌های Orbit
const orbit = new FirstPersonControls(Camera, canvas);
orbit.movementSpeed = 8;
orbit.lookSpeed = 0.08;

// انیمیشن
const clock = new three.Clock();
const animation = () => {
  renderer.render(Sc, Camera);
  // orbit.update(clock.getDelta());
  requestAnimationFrame(animation);
};
animation();

window.addEventListener("resize", () => {
  size.width = window.innerWidth;
  size.height = window.innerHeight;
  Camera.aspect = size.width / size.height;
  Camera.updateProjectionMatrix();
  renderer.setSize(size.width, size.height);
});

// Saman Tofighian
