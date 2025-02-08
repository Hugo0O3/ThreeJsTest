import * as THREE from 'three';

// 1️⃣ Création de la scène, caméra et rendu
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 2️⃣ Définition du shader pour le dégradé radial
const vertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;

  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  varying vec3 vPosition;

  void main() {
    // Calcul de la distance au centre de la face
    float dist = length(vUv - vec2(0.5, 0.5)); // distance depuis le centre de la face
    vec3 color2 = vec3(0.1, 0.1, 0.4); // Bleu foncé
    vec3 color1 = vec3(0.5, 0, 0.4); // Rose

    // Mélange des couleurs en fonction de la distance
    vec3 gradient = mix(color1, color2, dist);

    gl_FragColor = vec4(gradient, 1.0);
  }
`;

const gradientMaterial = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
});

// 3️⃣ Création du cube avec le dégradé radial
const geometry = new THREE.BoxGeometry();
const cube = new THREE.Mesh(geometry, gradientMaterial);
scene.add(cube);

// 4️⃣ Position de la caméra
camera.position.z = 4;

// 5️⃣ Variables pour la rotation fluide
let rotationSpeedX = 0.01;
let rotationSpeedY = 0.01;
let rotationSpeedZ = 0.005;

// 6️⃣ Fonction pour changer aléatoirement la direction de rotation toutes les 2 secondes
function changeRotationDirection() {
    rotationSpeedX = (Math.random() - 0.5) * 0.02;
    rotationSpeedY = (Math.random() - 0.5) * 0.02;
    rotationSpeedZ = (Math.random() - 0.5) * 0.02;
    setTimeout(changeRotationDirection, 2000); // Changement toutes les 2 secondes
}
changeRotationDirection(); // Démarrer le changement de direction

// 7️⃣ Fonction d'animation avec rotation fluide
function animate() {
    requestAnimationFrame(animate);

    // Appliquer la rotation avec une vitesse fluide
    cube.rotation.x += rotationSpeedX;
    cube.rotation.y += rotationSpeedY;
    cube.rotation.z += rotationSpeedZ;

    renderer.render(scene, camera);
}
animate();
