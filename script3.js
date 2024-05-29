// Import Three.js (ensure this line is at the top of the script)
import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js";

let scene, camera, renderer;
let centralSphere,
  planets = [];
let clock = new THREE.Clock();

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Create central sphere (sun)
  const geometry = new THREE.SphereGeometry(1, 32, 32);
  const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  centralSphere = new THREE.Mesh(geometry, material);
  scene.add(centralSphere);

  // Create planets
  const planetGeometry = new THREE.SphereGeometry(0.2, 32, 32);
  const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff];
  for (let i = 0; i < 5; i++) {
    const planetMaterial = new THREE.MeshBasicMaterial({ color: colors[i] });
    const planet = new THREE.Mesh(planetGeometry, planetMaterial);
    planets.push(planet);
    scene.add(planet);
  }

  camera.position.z = 5;

  // Add basic ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  // Add directional light for better visibility
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(5, 5, 5).normalize();
  scene.add(directionalLight);
}

function animate() {
  requestAnimationFrame(animate);

  const elapsed = clock.getElapsedTime();

  // Update planets position
  planets.forEach((planet, index) => {
    const angle = elapsed * (0.2 + 0.1 * index);
    const radius = 2 + index * 0.5;
    planet.position.x = Math.cos(angle) * radius;
    planet.position.y = Math.sin(angle) * radius;

    // Apply floating effect
    planet.position.z = 0.2 * Math.sin(elapsed * 2 + index);
  });

  renderer.render(scene, camera);
}

init();
animate();
