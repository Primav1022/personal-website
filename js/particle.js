class ParticleBackground {
    constructor() {
        this.canvas = document.getElementById('bgCanvas');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true });
        
        this.particles = [];
        this.init();
    }

    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight * 0.67);
        this.camera.position.z = 5;

        // 创建粒子几何体
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        
        for(let i = 0; i < 1000; i++) {
            vertices.push(
                Math.random() * 2000 - 1000,
                Math.random() * 2000 - 1000,
                Math.random() * 2000 - 1000
            );
        }
        
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        
        // 创建粒子材质
        const material = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 2,
            transparent: true,
            opacity: 0.8
        });
        
        // 创建粒子系统
        this.particleSystem = new THREE.Points(geometry, material);
        this.scene.add(this.particleSystem);
        
        // 添加动画
        this.animate();
        
        // 响应窗口调整
        window.addEventListener('resize', () => this.onWindowResize());
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        this.particleSystem.rotation.x += 0.001;
        this.particleSystem.rotation.y += 0.001;
        
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / (window.innerHeight * 0.67);
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight * 0.67);
    }
} 