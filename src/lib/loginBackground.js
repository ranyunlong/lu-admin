import THREE from './three'


export default function (container) {
    let width = container.clientWidth;
    let height = container.clientHeight;
    let aspect = width / height;
    const renderer = new THREE.WebGLRenderer();
    renderer.domElement.style.position = 'absolute'
    container.appendChild(renderer.domElement);
    function start() {
        width = container.clientWidth;
        height = container.clientHeight;
        aspect = width / height;
        renderer.setSize(width, height);
        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 1000);
        camera.position.z = 500

        const system = new THREE.Group(); // planetary system

        scene.add(
            new THREE.AmbientLight(0xFFFFFF, 0.2)
        );

        const light = new THREE.DirectionalLight(0xFFFFFF, 2.5);
        light.position.set(1500, 2500, 0);
        scene.add(light);

        const material = new THREE.MeshLambertMaterial({
            color: 0x0C2D4D
        });

        const planet = new THREE.Mesh(
            new THREE.IcosahedronGeometry(100, 3),
            material
        );

        for (let i = 0; i < planet.geometry.vertices.length; i++)
            planet.geometry.vertices[i].multiplyScalar(
                Math.random() * 0.05 + 0.95
            );

        planet.geometry.computeFlatVertexNormals();
        system.add(planet);

        const asteroids = new THREE.Group();

        for (let p = 0; p < Math.PI * 2; p = p + Math.random() * 0.15) {
            const asteroid = new THREE.Mesh(
                new THREE.IcosahedronGeometry(8, 0),
                material
            );

            let size = Math.random() * 0.5;
            for (let i = 0; i < asteroid.geometry.vertices.length; i++)
                asteroid.geometry.vertices[i].multiplyScalar(
                    Math.random() * 0.5 + size
                );

            let rand = Math.random() * 60 - 30;
            asteroid.position.set(200 * Math.sin(p) + rand, rand, 200 * Math.cos(p) + rand);

            asteroid.geometry.computeFlatVertexNormals();
            asteroids.add(asteroid);
        }

        system.add(asteroids);

        system.rotation.x = 0.1;
        system.rotation.y = -.3;
        system.rotation.z = -0.4;

        scene.add(system);

        for (let i = 0; i < 10; i++) {
            const particles = new THREE.Points(
                new THREE.Geometry(),
                new THREE.PointsMaterial({
                    size: Math.random() * 5
                })
            );
            for (let j = 0; j < 20; j++) {
                var vertex = new THREE.Vector3();
                vertex.x = Math.random() * width * 1.1 - width * 1.1 / 2;
                vertex.y = Math.random() * height * 1.1 - height * 1.1 / 2;
                vertex.z = -500;
                particles.geometry.vertices.push(vertex);
                particles.material.color.setScalar(Math.random() * 0.4 + 0.2);
            }
            scene.add(particles);
        }

        function render() {
            requestAnimationFrame(render);
            planet.rotation.y += 0.001;
            planet.rotation.z -= 0.0005;
            asteroids.rotation.y += 0.003;
            renderer.render(scene, camera);
        }

        render();
    }
    window.addEventListener('resize', function() {

        renderer.domElement.width = container.clientWidth;
        renderer.domElement.height = container.clientHeight;
        renderer.domElement.style.width = container.clientWidth + 'px'
        renderer.domElement.style.height = container.clientHeight + 'px'
        start()
    })
    start()
}