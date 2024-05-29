let scene, camera, renderer, loader;
let sun,
  objects = [];

const objectData = [
  { path: "apple_model.stl", size: 0.001, distance: 2 },
  { path: "apple_model.stl", size: 0.002, distance: 4 },
  { path: "apple_model.stl", size: 0.004, distance: 6 },
  { path: "apple_model.stl", size: 0.003, distance: 8 },
];

init();
animate();

function init() {
  // Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  // Camera
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 10, 20);
  camera.lookAt(0, 0, 0);

  // Renderer
  renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#webgl-canvas"),
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Sun
  const sunGeometry = new THREE.SphereGeometry(1, 32, 32);
  const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  sun = new THREE.Mesh(sunGeometry, sunMaterial);
  scene.add(sun);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(10, 10, 10);
  scene.add(pointLight);

  // STL Loader
  loader = new THREE.STLLoader();

  // Load objects
  objectData.forEach((data, index) => {
    loader.load(data.path, (geometry) => {
      const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
      const object = new THREE.Mesh(geometry, material);
      object.scale.set(data.size, data.size, data.size);
      object.position.x = data.distance;
      scene.add(object);
      objects.push({ mesh: object, distance: data.distance, angle: 0 });

      // Add orbit
      const orbitGeometry = new THREE.RingGeometry(
        data.distance - 0.01,
        data.distance + 0.01,
        64
      );
      const orbitMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
      });
      const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
      orbit.rotation.x = Math.PI / 2;
      scene.add(orbit);
    });
  });
}

function animate() {
  requestAnimationFrame(animate);

  // Rotate objects
  objects.forEach((object) => {
    object.angle += 0.01;
    object.mesh.position.x = object.distance * Math.cos(object.angle);
    object.mesh.position.z = object.distance * Math.sin(object.angle);
  });

  renderer.render(scene, camera);
}

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
