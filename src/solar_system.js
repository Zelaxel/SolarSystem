import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GUI from "lil-gui";
import sunImageUrl from "./sun.jpg";
import mercuryImageUrl from "./mercury.jpg";
import venusImageUrl from "./venus.jpg";
import earthImageUrl from "./earth.jpg";
import lunaImageUrl from "./luna.jpg";
import marsImageUrl from "./mars.jpg";
import fobosImageUrl from "./fobos.jpg";
import deimosImageUrl from "./deimos.jpg";
import jupiterImageUrl from "./jupiter.jpg";
import ioImageUrl from "./io.jpg";
import ganemidImageUrl from "./ganemid.jpg";
import callistoImageUrl from "./callisto.jpg";
import saturnImageUrl from "./saturn.jpg";
import enceladusImageUrl from "./enceladus.jpg";
import titanImageUrl from "./titan.jpg";
import lapetusImageUrl from "./lapetus.jpg";
import uranusImageUrl from "./uranus.jpg";
import titaniaImageUrl from "./titania.jpg";
import neptuneImageUrl from "./neptune.jpg";
import tritonImageUrl from "./triton.jpg";
import serisImageUrl from "./seris.jpg";

const gui = new GUI("Point of view");

const cameraActions = {
  sun: () => { trackedObject = sun;},
  mercury: () => { trackedObject = mercury},
  venus: () => { trackedObject = venus},
  earth: () => { trackedObject = earth},
  mars: () => { trackedObject = mars},
  jupiter: () => { trackedObject = jupiter},
  saturn: () => { trackedObject = saturn},
  uranus: () => { trackedObject = uranus},
  neptune: () => { trackedObject = neptune},
  luna: () => { trackedObject = luna},
  fobos: () => { trackedObject = fobos},
  deimos: () => { trackedObject = deimos},
  io: () => { trackedObject = io},
  ganemid: () => { trackedObject = ganemid},
  callisto: () => { trackedObject = callisto},
  enceladus: () => { trackedObject = enceladus},
  titan: () => { trackedObject = titan},
  lapetus: () => { trackedObject = lapetus},
  titania: () => { trackedObject = titania},
  triton: () => { trackedObject = triton},
  seris: () => { trackedObject = seris}
};

let scene;
let camera;
let renderer;
let t0;
let accglobal = 0.001;
let timestamp;

// Textures

const suntxt = new THREE.TextureLoader().load(sunImageUrl);
const earthtxt = new THREE.TextureLoader().load(earthImageUrl);
const mercurytxt = new THREE.TextureLoader().load(mercuryImageUrl);
const venustxt = new THREE.TextureLoader().load(venusImageUrl);
const lunatxt = new THREE.TextureLoader().load(lunaImageUrl);
const marstxt = new THREE.TextureLoader().load(marsImageUrl);
const fobostxt = new THREE.TextureLoader().load(fobosImageUrl);
const deimostxt = new THREE.TextureLoader().load(deimosImageUrl);
const jupitertxt = new THREE.TextureLoader().load(jupiterImageUrl);
const iotxt = new THREE.TextureLoader().load(ioImageUrl);
const ganemidtxt = new THREE.TextureLoader().load(ganemidImageUrl);
const callistotxt = new THREE.TextureLoader().load(callistoImageUrl);
const saturntxt = new THREE.TextureLoader().load(saturnImageUrl);
const enceladustxt = new THREE.TextureLoader().load(enceladusImageUrl);
const titantxt = new THREE.TextureLoader().load(titanImageUrl);
const lapetustxt = new THREE.TextureLoader().load(lapetusImageUrl);
const uranustxt = new THREE.TextureLoader().load(uranusImageUrl);
const titaniatxt = new THREE.TextureLoader().load(titaniaImageUrl);
const neptunetxt = new THREE.TextureLoader().load(neptuneImageUrl);
const tritontxt = new THREE.TextureLoader().load(tritonImageUrl);
const seristxt = new THREE.TextureLoader().load(serisImageUrl);

// Planets

let satellites = []
let asteroids = []
let camcontrols;
let sun;
let mercury;
let venus;
let earth;
let mars;
let jupiter;
let saturn;
let uranus;
let neptune;
let luna;
let fobos;
let deimos;
let ganemid;
let callisto;
let io;
let titan;
let enceladus;
let lapetus;
let titania;
let triton;
let seris

let trackedObject;
let currentPos;
let previousPos;

function init() {
    // Camera.
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      20000
    );
    camera.position.set(0, 0, 1000);

    // Render.
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    camcontrols = new OrbitControls(camera, renderer.domElement);

    t0 = Date.now();

    // ligth
    const Lpunt = new THREE.PointLight(0xffffff, 1, 0, 0.1);
    Lpunt.position.set(0, 0, 0);
    Lpunt.castShadow = true;
    scene.add(Lpunt);
    
    // bodies: radius, rotationSpeed, orbitalSpeed distance, focus, f1, f2, angle, color
    sun = createSun(20, suntxt);
    mercury = createSatellite(2, 0.01, 1.5, 40, sun, 1, 1.205, 0.122, mercurytxt);
    venus = createSatellite(2.6, 0.01, 1, 80, sun, 1, 1.007, 0.059, venustxt);
    earth = createSatellite(3, 0.01, 0.8, 150, sun, 1, 1.017, 0, earthtxt);
      luna =  createSatellite(1.5, 0.01, 1, 20, earth, 1, 1.0549, 0.0898, lunatxt);
    mars = createSatellite(2.4, 0.01, 0.5, 250, sun, 1, 1.099, 0.032, marstxt);
      fobos = createSatellite(0.7, 0.01, 1, 15, mars, 1, 1.0151, 0.0190, fobostxt);
      deimos = createSatellite(0.5, 0.01, 0.5, 30, mars, 1, 1.0003, 0.0162, deimostxt);
    seris = createSatellite(2.4, 0.01, 0.5, 310, sun, 1, 1.099, 0.032, seristxt);
    
    // Asteroid belt
    for(let i=0; i<100; i++) {
      createAsteroid(0.5 + Math.random()*2, 300 + 20 * Math.random(), 0.2 + 0.01 * Math.random(), Math.random() * Math.PI * 2, sun);
    }
    
    jupiter = createSatellite(13, 0.01, 0.4, 400, sun, 1, 1.049, 0.023, jupitertxt);
      io = createSatellite(1, 0.01, 0.8, 30, jupiter, 1, 1.0013, 0.00087, iotxt);
      ganemid = createSatellite(2.2, 0.01, 0.3, 50, jupiter, 1, 1.0013, 0.0314, ganemidtxt);
      callisto = createSatellite(1.8, 0.01, 0.05, 80, jupiter, 1, 1.0013, 0.0335, callistotxt);
    saturn = createSatellite(10, 0.01, 0.2, 600, sun, 1, 1.057, 0.044, saturntxt);
      enceladus = createSatellite(0.5, 0.01, 0.8, 30, saturn, 1, 1.0013, 0.00087, enceladustxt);
      titan = createSatellite(2, 0.01, 0.3, 50, saturn, 1, 1.0013, 0.0314, titantxt);
      lapetus = createSatellite(1.5, 0.01, 0.05, 80, saturn, 1, 1.0013, 0.0335, lapetustxt);
    uranus = createSatellite(7, 0.01, 0.1, 800, sun, 1, 1.046, 0.014, uranustxt);
      titania = createSatellite(2, 0.01, 0.3, 50, uranus, 1, 1.0013, 0.0314, titaniatxt);
    neptune = createSatellite(7, 0.01, 0.05, 1000, sun, 1, 1.011, 0.031, neptunetxt);
      triton = createSatellite(1.5, 0.01, 0.3, 50, neptune, 1, 1.0013, 0.0314, tritontxt);

    // Kuiper belt
    for(let i=0; i<500; i++) {
      createAsteroid(0.5 + Math.random()*2, 1100 + 40 * Math.random(), 0.05 + 0.02 * Math.random(), Math.random() * Math.PI * 2, sun);
    }
    
    for(let i = 0; i < 2000; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2 * Math.PI;
      const R = 4000;
      const phi = Math.acos(1 - 2 * v);
      createStar(1.5 + Math.random()*8, R * Math.sin(phi) * Math.cos(theta), R * Math.sin(phi) * Math.sin(theta), R * Math.cos(phi));
    }

    window.addEventListener('resize', onWindowResize, false);
    
    // Set track.

    trackedObject = sun;
    currentPos = new THREE.Vector3();
    previousPos = new THREE.Vector3();

    const delta = new THREE.Vector3().subVectors(currentPos, previousPos);

    // GUI
    const focusSunFolder = gui.addFolder('Follow sun');
    const focusPlanetFolder = gui.addFolder('Follow planet');
    const focusMoonFolder = gui.addFolder('Follow moon');

    focusSunFolder.add(cameraActions, 'sun').name('Sun');

    focusPlanetFolder.add(cameraActions, 'mercury').name('Mercury');
    focusPlanetFolder.add(cameraActions, 'venus').name('Venus');
    focusPlanetFolder.add(cameraActions, 'earth').name('Earth');
    focusPlanetFolder.add(cameraActions, 'mars').name('Mars');
    focusPlanetFolder.add(cameraActions, 'jupiter').name('Jupiter');
    focusPlanetFolder.add(cameraActions, 'saturn').name('Saturn');
    focusPlanetFolder.add(cameraActions, 'uranus').name('Uranus');
    focusPlanetFolder.add(cameraActions, 'neptune').name('Neptune');
    focusPlanetFolder.add(cameraActions, 'seris').name('Seris');

    focusMoonFolder.add(cameraActions, 'luna').name('Luna');
    focusMoonFolder.add(cameraActions, 'fobos').name('Fobos');
    focusMoonFolder.add(cameraActions, 'deimos').name('Deimos');
    focusMoonFolder.add(cameraActions, 'io').name('Io');
    focusMoonFolder.add(cameraActions, 'ganemid').name('Ganemid');
    focusMoonFolder.add(cameraActions, 'callisto').name('Callisto');
    focusMoonFolder.add(cameraActions, 'enceladus').name('Enceladus');
    focusMoonFolder.add(cameraActions, 'titan').name('Titan');
    focusMoonFolder.add(cameraActions, 'lapetus').name('Lapetus');
    focusMoonFolder.add(cameraActions, 'titania').name('Titania');
    focusMoonFolder.add(cameraActions, 'triton').name('Triton');
}

function animate() {
    timestamp = (Date.now() - t0) * accglobal;
    requestAnimationFrame(animate);

    for (let object of satellites) {
      object.position.x =
        Math.sin(timestamp * object.userData.orbitSpeed) * object.userData.distance * object.userData.f1;
      object.position.z =
        Math.cos(timestamp * object.userData.orbitSpeed) * object.userData.distance * object.userData.f2;
        object.rotation.y += object.userData.rotationSpeed;
      }
      
      for (let object of asteroids) {
        object.position.x = Math.sin(timestamp * object.userData.orbitSpeed + object.userData.initialPosition) * object.userData.distance
        object.position.z = Math.cos(timestamp * object.userData.orbitSpeed + object.userData.initialPosition) * object.userData.distance
      }
      
      trackedObject.getWorldPosition(currentPos);
      const delta = new THREE.Vector3().subVectors(currentPos, previousPos);
      camera.position.add(delta);
      camcontrols.target.add(delta);
      previousPos.copy(currentPos);

      renderer.render(scene, camera);
    }
    
function createStar(radius, px, py, pz) {
      let geometry = new THREE.SphereGeometry(radius, 2, 2);
      let material = new THREE.MeshBasicMaterial({ color: 0xffffff });
      let object = new THREE.Mesh(geometry, material);
      
      object.position.x = px;
      object.position.y = py;
      object.position.z = pz;

      scene.add(object);
    
      return object

}

function createAsteroid(radius, distance, orbitSpeed, initialPosition, focus) {
    var pivote = new THREE.Object3D();
    focus.add(pivote);

    let geometry = new THREE.SphereGeometry(radius, 2, 2);
    let material = new THREE.MeshPhongMaterial({ color: 0xa3a3a3 });
    let object = new THREE.Mesh(geometry, material);

    pivote.add(object);

    object.userData.orbitSpeed=orbitSpeed;
    object.userData.distance=distance;
    object.userData.initialPosition=initialPosition;

    asteroids.push(object);

    return object;
}

function createSun(radius, texture=undefined) {
    let geometry = new THREE.SphereGeometry(radius, 20, 20);
    let material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    if (texture) {
        material.map = texture;
    }
    let object = new THREE.Mesh(geometry, material);
    scene.add(object);
    return object;
  }

function createSatellite(radius, rotationSpeed, orbitSpeed, distance, focus, f1, f2, angle, texture=undefined, orbit=true) {
    var pivote = new THREE.Object3D();
    pivote.rotation.x = angle;
    focus.add(pivote);

    let geometry = new THREE.SphereGeometry(radius, 20, 20);
    let material = new THREE.MeshPhongMaterial({ color: 0xffffff });
    if (texture) {
        material.map = texture;
    }
    let object = new THREE.Mesh(geometry, material);

    pivote.add(object);

    object.userData.rotationSpeed=rotationSpeed;
    object.userData.orbitSpeed=orbitSpeed;
    object.userData.distance=distance;
    object.userData.f1=f1;
    object.userData.f2=f2;

    satellites.push(object);

    if(orbit) {
      let curve = new THREE.EllipseCurve(
        0,
        0,
        distance * f1,
        distance * f2
      );
      //Crea geometría
      let points = curve.getPoints(50);
      let geome = new THREE.BufferGeometry().setFromPoints(points);
      let mate = new THREE.LineBasicMaterial({ color: 0xffffff });
      // Objeto
      let orbit = new THREE.Line(geome, mate);
      pivote.add(orbit);
      orbit.rotation.x = (Math.PI / 2)
    }
    
    return object;
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

init();
animate();