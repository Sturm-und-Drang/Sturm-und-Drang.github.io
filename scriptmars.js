function createPlanetScene(canvasId, textureUrl, size, rotationSpeed) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.error(`Canvas with id "${canvasId}" not found.`);
        return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 400);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
    scene.add(ambientLight);

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
        textureUrl,
        (loadedTexture) => {
            loadedTexture.wrapS = THREE.RepeatWrapping;
            loadedTexture.wrapT = THREE.RepeatWrapping;
            loadedTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
            loadedTexture.needsUpdate = true;
            loadedTexture.minFilter = THREE.LinearMipMapLinearFilter;
            loadedTexture.magFilter = THREE.LinearFilter;
            loadedTexture.repeat.set(1, 1);

            const geometry = new THREE.SphereGeometry(size, 500, 500);
            const material = new THREE.MeshStandardMaterial({ map: loadedTexture });
            const planet = new THREE.Mesh(geometry, material);
            scene.add(planet);

            function animate() {
                requestAnimationFrame(animate);
                planet.rotation.y += rotationSpeed;
                renderer.render(scene, camera);
            }
            animate();
        },
        undefined,
        (error) => {
            console.error('Error loading texture:', error);
        }
    );

    camera.position.z = 5;
    function centerObjects() {
        camera.position.set(1, 1, 5);
        camera.lookAt(0, 0, 0);
    }
    centerObjects();

    window.addEventListener('resize', () => {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });
}

createPlanetScene('earthCanvas', 'https://i.imgur.com/ZbR4hzM.jpeg', 2.2, 0.005);
createPlanetScene('marsCanvas', 'https://cdn.prod.website-files.com/5a621bf894d1cf000155a6d3/5d00f3bcec96461bc92c5472_opmbuilder_opm_mars_colour_celestia_20190612143601.png', 2.9, 0.005);