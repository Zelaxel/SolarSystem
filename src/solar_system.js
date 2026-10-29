import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GUI from "lil-gui";


const gui = new GUI("Point of view");

const cameraActions = {
  sun: () => { trackedObject = sun},
  mercury: () => { trackedObject = mercury},
  venus: () => { trackedObject = venus},
  earth: () => { trackedObject = earth},
  mars: () => { trackedObject = mars},
  jupiter: () => { trackedObject = jupiter},
  saturn: () => { trackedObject = saturn},
  uranus: () => { trackedObject = uranus},
  neptune: () => { trackedObject = neptune}
};

let scene;
let camera;
let renderer;
let t0;
let accglobal = 0.001;
let timestamp;

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
let calisto;
let io;

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
    
    // bodies: radius, rotationSpeed, orbitalSpeed distance, focus, f1, f2, angle, color
    sun = createSun(20, 0xffff00);
    mercury = createSatellite(2, 0.01, 1.5, 40, sun, 1, 1.205, 0.122, 0xdab578);
    venus = createSatellite(2.6, 0.01, 1, 80, sun, 1, 1.007, 0.059, 0xaf5c50);
    earth = createSatellite(3, 0.01, 0.8, 150, sun, 1, 1.017, 0, 0x0000ff);
    luna =  createSatellite(1.5, 0.01, 1, 20, earth, 1, 1.0549, 0.0898, 0xdddddd);
    mars = createSatellite(2.4, 0.01, 0.5, 250, sun, 1, 1.099, 0.032, 0xb66055);
    fobos = createSatellite(0.7, 0.01, 1, 15, mars, 1, 1.0151, 0.0190, 0xdddddd);
    deimos = createSatellite(0.5, 0.01, 0.5, 30, mars, 1, 1.0003, 0.0162, 0xdddddd);
    
    // Asteroid belt
    for(let i=0; i<100; i++) {
      createAsteroid(0.5 + Math.random()*2, 300 + 20 * Math.random(), 0.2 + 0.01 * Math.random(), Math.random() * Math.PI * 2, sun);
    }
    
    jupiter = createSatellite(13, 0.01, 0.4, 400, sun, 1, 1.049, 0.023, 0xe29e41);
      io = createSatellite(1, 0.01, 0.8, 30, jupiter, 1, 1.0013, 0.00087, 0x96C77D);
      ganemid = createSatellite(2.2, 0.01, 0.3, 50, jupiter, 1, 1.0013, 0.0314, 0x96C77D);
      calisto = createSatellite(1.8, 0.01, 0.05, 80, jupiter, 1, 1.0013, 0.0335, 0xEDF2D5);
    saturn = createSatellite(10, 0.01, 0.2, 600, sun, 1, 1.057, 0.044, 0xbedcd5c);
    uranus = createSatellite(7, 0.01, 0.1, 800, sun, 1, 1.046, 0.014, 0xb7dd0f6);
    neptune = createSatellite(7, 0.01, 0.05, 1000, sun, 1, 1.011, 0.031, 0x5b60dc);

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

    trackedObject = earth;
    currentPos = new THREE.Vector3();
    previousPos = new THREE.Vector3();

    const delta = new THREE.Vector3().subVectors(currentPos, previousPos);

    // GUI
    const focusFolder = gui.addFolder('Follow planet');

    focusFolder.add(cameraActions, 'sun').name('Sun');
    focusFolder.add(cameraActions, 'mercury').name('Mercury');
    focusFolder.add(cameraActions, 'venus').name('Venus');
    focusFolder.add(cameraActions, 'earth').name('Earth');
    focusFolder.add(cameraActions, 'mars').name('Mars');
    focusFolder.add(cameraActions, 'jupiter').name('Jupiter');
    focusFolder.add(cameraActions, 'saturn').name('Saturn');
    focusFolder.add(cameraActions, 'uranus').name('Uranus');
    focusFolder.add(cameraActions, 'neptune').name('Neptune');
}

function animate() {
    timestamp = (Date.now() - t0) * accglobal;
    requestAnimationFrame(animate);

    for (let object of satellites) {
      console.log(object);
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
    let material = new THREE.MeshBasicMaterial({ color: 0xa3a3a3 });
    let object = new THREE.Mesh(geometry, material);

    pivote.add(object);

    object.userData.orbitSpeed=orbitSpeed;
    object.userData.distance=distance;
    object.userData.initialPosition=initialPosition;

    asteroids.push(object);

    return object;
}

function createSun(radius, color) {
    let geometry = new THREE.SphereGeometry(radius, 20, 20);
    let material = new THREE.MeshBasicMaterial({ color: color });
    let object = new THREE.Mesh(geometry, material);
    scene.add(object);
    return object;
  }

function createSatellite(radius, rotationSpeed, orbitSpeed, distance, focus, f1, f2, angle, color, orbit=true) {
    var pivote = new THREE.Object3D();
    pivote.rotation.x = angle;
    focus.add(pivote);

    let geometry = new THREE.SphereGeometry(radius, 20, 20);
    let material = new THREE.MeshBasicMaterial({ color: color });
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