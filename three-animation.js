function initSkinCellAnimation() {
    // Check if we're on homepage
    if (!document.querySelector('.hero')) return;

    const container = document.getElementById('skinCellAnimation');
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    container.appendChild(renderer.domElement);

    // Colors matching your brand
    const colors = [
        new THREE.Color(0xFFDAC1), // Soft peach
        new THREE.Color(0xE2F0CB), // Mint
        new THREE.Color(0xB5EAD7), // Light teal
        new THREE.Color(0xFFB7B2)  // Soft pink
    ];

    // Create organic-looking cells
    const cells = [];
    const cellCount = 30;
    
    for (let i = 0; i < cellCount; i++) {
        const geometry = new THREE.SphereGeometry(
            0.5 + Math.random() * 0.5,
            10,
            10
        );
        
        // Make cells irregular
        geometry.vertices.forEach(v => {
            v.x += (Math.random() - 0.5) * 0.3;
            v.y += (Math.random() - 0.5) * 0.3;
            v.z += (Math.random() - 0.5) * 0.3;
        });
        
        const material = new THREE.MeshPhongMaterial({
            color: colors[Math.floor(Math.random() * colors.length)],
            transparent: true,
            opacity: 0.6,
            specular: 0x111111,
            shininess: 30
        });
        
        const cell = new THREE.Mesh(geometry, material);
        
        cell.position.set(
            (Math.random() - 0.5) * 30,
            (Math.random() - 0.5) * 30,
            (Math.random() - 0.5) * 30
        );
        
        // Store animation properties
        cell.userData = {
            speed: 0.01 + Math.random() * 0.02,
            direction: new THREE.Vector3(
                Math.random() - 0.5,
                Math.random() - 0.5,
                Math.random() - 0.5
            ).normalize()
        };
        
        scene.add(cell);
        cells.push(cell);
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    camera.position.z = 25;

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        cells.forEach(cell => {
            cell.position.x += cell.userData.direction.x * cell.userData.speed;
            cell.position.y += cell.userData.direction.y * cell.userData.speed;
            cell.position.z += cell.userData.direction.z * cell.userData.speed;
            
            // Boundary check
            const boundary = 20;
            ['x', 'y', 'z'].forEach(axis => {
                if (Math.abs(cell.position[axis]) > boundary) {
                    cell.userData.direction[axis] *= -1;
                }
            });
        });
        
        renderer.render(scene, camera);
    }

    // Handle resize
    window.addEventListener('resize', function() {
        camera.aspect = container.offsetWidth / container.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.offsetWidth, container.offsetHeight);
    });

    animate();
}

document.addEventListener('DOMContentLoaded', initSkinCellAnimation);