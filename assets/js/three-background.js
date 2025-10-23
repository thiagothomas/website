/* global THREE */
(() => {
    'use strict';

    if (typeof window === 'undefined') {
        return;
    }

    const { THREE } = window;

    if (!THREE) {
        console.warn('[LiquidIntelligence] Three.js not found – skipping WebGL background.');
        return;
    }

    // Vertex Shader - Animated metaball-like particles
    const VERTEX_SHADER = `
        uniform float uTime;
        uniform float uScrollProgress;
        attribute float aSize;
        attribute float aSeed;
        attribute vec3 aVelocity;
        varying float vAlpha;
        varying float vSeed;

        // Simple noise
        float hash(float n) {
            return fract(sin(n) * 43758.5453123);
        }

        void main() {
            vec3 pos = position;
            float time = uTime * 0.3;

            // Organic flowing motion
            float angle = aSeed * 6.28318 + time * (0.5 + aSeed * 0.3);
            float radius = 2.0 + sin(aSeed * 10.0) * 1.5;

            pos.x += cos(angle) * radius;
            pos.y += sin(time * 0.4 + aSeed * 3.0) * 1.5;
            pos.z += sin(angle * 0.7) * 1.0;

            // Add noise-based offset for organic feel
            pos.x += sin(time * 0.8 + aSeed * 7.0) * 0.8;
            pos.y += cos(time * 0.6 + aSeed * 5.0) * 0.8;

            // Camera distance
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            float distanceFromCamera = -mvPosition.z;

            // Size based on distance and pulsing
            float pulse = 1.0 + sin(time * 2.0 + aSeed * 6.28) * 0.3;
            gl_PointSize = aSize * pulse * (300.0 / distanceFromCamera);

            gl_Position = projectionMatrix * mvPosition;

            // Alpha fade based on distance
            vAlpha = 1.0 - smoothstep(5.0, 15.0, distanceFromCamera);
            vSeed = aSeed;
        }
    `;

    // Fragment Shader - Soft glowing circles
    const FRAGMENT_SHADER = `
        precision highp float;
        uniform float uTime;
        varying float vAlpha;
        varying float vSeed;

        void main() {
            vec2 uv = gl_PointCoord - vec2(0.5);
            float dist = length(uv);

            // Soft circle with glow
            float alpha = 1.0 - smoothstep(0.2, 0.5, dist);
            alpha *= vAlpha;

            // Pulsing brightness
            float brightness = 0.6 + sin(uTime * 1.5 + vSeed * 6.28) * 0.4;

            // Monochromatic white/gray
            vec3 color = vec3(1.0) * brightness;

            // Extra glow in center
            float glow = 1.0 - smoothstep(0.0, 0.3, dist);
            color += glow * 0.3;

            gl_FragColor = vec4(color, alpha * 0.8);
        }
    `;

    class LiquidIntelligence {
        constructor() {
            this.canvas = document.getElementById('stellarBackdrop');
            if (!this.canvas) {
                console.warn('[LiquidIntelligence] Canvas not found');
                return;
            }

            this.prefersReducedMotion = typeof window.matchMedia === 'function'
                ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
                : false;

            this.init();
            this.setupEventListeners();
            this.animate();
        }

        init() {
            // Renderer setup
            this.renderer = new THREE.WebGLRenderer({
                canvas: this.canvas,
                alpha: true,
                antialias: false, // Disable for performance
                powerPreference: 'high-performance'
            });

            // Lower pixel ratio for performance
            const isMobile = window.innerWidth < 768;
            const pixelRatio = isMobile ? 0.6 : 1.0;
            this.renderer.setPixelRatio(pixelRatio);
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setClearColor(0x000000, 0);

            // Scene and camera
            this.scene = new THREE.Scene();
            this.camera = new THREE.PerspectiveCamera(
                60,
                window.innerWidth / window.innerHeight,
                0.1,
                100
            );
            this.camera.position.z = 8;

            this.clock = new THREE.Clock();
            this.scrollProgress = 0;

            // Create particles
            this.createParticles();

            // Fade in
            setTimeout(() => {
                this.canvas.classList.add('is-ready');
            }, 100);
        }

        createParticles() {
            // Particle count based on device
            const isMobile = window.innerWidth < 768;
            const count = isMobile ? 40 : 80;

            const positions = new Float32Array(count * 3);
            const sizes = new Float32Array(count);
            const seeds = new Float32Array(count);
            const velocities = new Float32Array(count * 3);

            for (let i = 0; i < count; i++) {
                const i3 = i * 3;

                // Random starting positions
                positions[i3] = (Math.random() - 0.5) * 10;
                positions[i3 + 1] = (Math.random() - 0.5) * 10;
                positions[i3 + 2] = (Math.random() - 0.5) * 5;

                // Varying sizes for depth
                sizes[i] = Math.random() * 2.0 + 1.0;

                // Unique seed per particle
                seeds[i] = Math.random();

                // Velocity (not used in current shader but kept for future)
                velocities[i3] = (Math.random() - 0.5) * 0.1;
                velocities[i3 + 1] = (Math.random() - 0.5) * 0.1;
                velocities[i3 + 2] = (Math.random() - 0.5) * 0.1;
            }

            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
            geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
            geometry.setAttribute('aVelocity', new THREE.BufferAttribute(velocities, 3));

            // Uniforms
            this.uniforms = {
                uTime: { value: 0 },
                uScrollProgress: { value: 0 }
            };

            const material = new THREE.ShaderMaterial({
                uniforms: this.uniforms,
                vertexShader: VERTEX_SHADER,
                fragmentShader: FRAGMENT_SHADER,
                transparent: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending
            });

            this.particles = new THREE.Points(geometry, material);
            this.scene.add(this.particles);
        }

        setupEventListeners() {
            window.addEventListener('resize', () => this.onResize(), { passive: true });
            window.addEventListener('scroll', () => this.onScroll(), { passive: true });
            this.onScroll();
        }

        onResize() {
            const width = window.innerWidth;
            const height = window.innerHeight;

            this.renderer.setSize(width, height);
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
        }

        onScroll() {
            const scrollable = document.documentElement.scrollHeight - window.innerHeight;
            if (scrollable <= 0) {
                this.scrollProgress = 0;
                return;
            }
            this.scrollProgress = Math.min(1, Math.max(0, window.scrollY / scrollable));
        }

        animate() {
            requestAnimationFrame(() => this.animate());

            const delta = this.clock.getDelta();
            const speed = this.prefersReducedMotion ? 0.3 : 0.6;

            this.uniforms.uTime.value += delta * speed;

            // Smooth scroll interpolation
            this.uniforms.uScrollProgress.value += (this.scrollProgress - this.uniforms.uScrollProgress.value) * 0.05;

            // Subtle scene rotation based on scroll
            this.scene.rotation.y = this.uniforms.uScrollProgress.value * 0.2;
            this.scene.rotation.x = this.uniforms.uScrollProgress.value * 0.1;

            this.renderer.render(this.scene, this.camera);
        }
    }

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        try {
            window.__liquidIntelligence = new LiquidIntelligence();
        } catch (error) {
            console.error('[LiquidIntelligence] Failed to initialize:', error);
        }
    });
})();
