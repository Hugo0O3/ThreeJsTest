import * as THREE from 'three';

// 1️⃣ Initialisation de la scène, de la caméra et du rendu
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 2️⃣ Lumières pour une balle bien blanche
const ambientLight = new THREE.AmbientLight(0xffffff, 2); // Lumière douce uniforme
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// 3️⃣ Création de la balle blanche
const ballGeometry = new THREE.SphereGeometry(1, 32, 32);
const ballMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff, // Blanc pur
    metalness: 0, // Pas de métal
    roughness: 0.1, // Légèrement lisse
    clearcoat: 1, // Effet brillant
    clearcoatRoughness: 0, // Surface bien polie
});
const ball = new THREE.Mesh(ballGeometry, ballMaterial);
scene.add(ball);

// 4️⃣ Ajout de trous noirs pour un effet réaliste
const holes = [];
const holeGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.2, 32);
const holeMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });

for (let i = 0; i < 12; i++) {
    const hole = new THREE.Mesh(holeGeometry, holeMaterial);
    
    // Placement des trous sur la surface
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;

    hole.position.set(
        Math.sin(phi) * Math.cos(theta),
        Math.sin(phi) * Math.sin(theta),
        Math.cos(phi)
    );

    hole.position.multiplyScalar(0.95); // Positionner les trous sur la surface
    hole.lookAt(ball.position); // Orienter les trous vers le centre
    ball.add(hole);
    holes.push(hole);
}

// 5️⃣ Position et vitesse de la balle
ball.position.set(-5, 0, 0);
let speed = 0.05;

// 6️⃣ Animation de la balle
function animate() {
    requestAnimationFrame(animate);

    // Déplacement
    ball.position.x += speed;
    ball.rotation.z -= speed * 2; // Effet de roulage

    // Rebond sur les bords
    if (ball.position.x > 5 || ball.position.x < -5) {
        speed *= -1;
    }

    renderer.render(scene, camera);
}

// 7️⃣ Lancer l'animation
animate();

// 8️⃣ Ajuster la taille au redimensionnement de la fenêtre
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// 9️⃣ Position de la caméra
camera.position.z = 8;
