// Basic Setup
let scene, camera, renderer, controls;

init();
animate();

function init() {
    // Create Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000); // Black background

    // Set Up Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.y = 1.6; // Position the camera slightly above the ground

    // Renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Add Lighting
    const light = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(light);

    // Add Floor
    const floorGeometry = new THREE.PlaneGeometry(500, 500); // Large floor
    const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x333333, side: THREE.DoubleSide });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2; // Rotate to make it flat
    scene.add(floor);

    // Pointer Lock Controls
    controls = new THREE.PointerLockControls(camera, document.body);
    document.body.addEventListener('click', () => {
        controls.lock(); // Click to engage controls
    });

    controls.addEventListener('lock', () => {
        console.log('Pointer locked');
    });

    controls.addEventListener('unlock', () => {
        console.log('Pointer unlocked');
    });

    // Movement Variables
    const moveSpeed = 0.1;
    const move = { forward: false, backward: false, left: false, right: false };

    document.addEventListener('keydown', (e) => {
        if (e.key === 'w') move.forward = true;
        if (e.key === 's') move.backward = true;
        if (e.key === 'a') move.left = true;
        if (e.key === 'd') move.right = true;
    });

    document.addEventListener('keyup', (e) => {
        if (e.key === 'w') move.forward = false;
        if (e.key === 's') move.backward = false;
        if (e.key === 'a') move.left = false;
        if (e.key === 'd') move.right = false;
    });

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);

        // Movement Logic
        if (controls.isLocked) {
            if (move.forward) controls.moveForward(moveSpeed);
            if (move.backward) controls.moveForward(-moveSpeed);
            if (move.left) controls.moveRight(-moveSpeed);
            if (move.right) controls.moveRight(moveSpeed);
        }

        renderer.render(scene, camera);
    }

    animate();
}
