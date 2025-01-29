import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild(renderer.domElement);

// Scènes
const scene1 = new THREE.Scene();
const scene2 = new THREE.Scene();

// Caméra
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(4, 5, 11);

// Contrôles
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 5;
controls.maxDistance = 20;
controls.minPolarAngle = 0.5;
controls.maxPolarAngle = 1.5;
controls.autoRotate = false;
controls.target = new THREE.Vector3(0, 1, 0);
controls.update();

// Sol pour les deux scènes
const groundGeometry = new THREE.PlaneGeometry(20, 20, 32, 32);
groundGeometry.rotateX(-Math.PI / 2);
const groundMaterial = new THREE.MeshStandardMaterial({
  color: 0x555555,
  side: THREE.DoubleSide
});
const groundMesh1 = new THREE.Mesh(groundGeometry, groundMaterial);
const groundMesh2 = new THREE.Mesh(groundGeometry, groundMaterial);

scene1.add(groundMesh1);
scene2.add(groundMesh2);

// Lumière
const spotLight1 = new THREE.SpotLight(0xfffff0, 3000, 100, 0.22, 1);
spotLight1.position.set(0, 25, 0);
spotLight1.castShadow = true;
spotLight1.shadow.bias = -0.0001;

const spotLight2 = new THREE.SpotLight(0xfff0ff, 3000, 100, 0.22, 1);
spotLight2.position.set(0, 20, 0);
spotLight2.castShadow = true;

scene1.add(spotLight1);
scene2.add(spotLight2);

// Charger un modèle dans la première scène
const loader1 = new GLTFLoader().setPath('models/');
loader1.load('scene1.gltf', (gltf) => {
  const mesh = gltf.scene;
  mesh.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  mesh.position.set(0, 1.05, -1);
  scene1.add(mesh);
}, undefined, (error) => console.error(error));

// Charger un modèle différent dans la deuxième scène
const loader2 = new GLTFLoader().setPath('models/');
loader2.load('scene2.gltf', (gltf) => {
  const mesh = gltf.scene;
  mesh.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  mesh.position.set(0, 1.05, -1);
  scene2.add(mesh);
}, undefined, (error) => console.error(error));

// Bascule entre les scènes
let currentScene = scene1;
document.addEventListener('keydown', (event) => {
  if (event.key === '1') currentScene = scene1; // Appuyez sur '1' pour la première scène
  if (event.key === '2') currentScene = scene2; // Appuyez sur '2' pour la deuxième scène
});

// Gestion de la taille de la fenêtre
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(currentScene, camera);
}

animate();
