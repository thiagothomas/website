// Enhanced Universe Background with Comets, Asteroids, and Stars
class UniverseBackground {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.comets = [];
        this.asteroids = [];
        this.shootingStars = [];
        this.clickWaves = [];
        this.mouse = { x: null, y: null };
        this.particleCount = window.innerWidth < 768 ? 40 : 80;
        this.maxDistance = 150;
        this.time = 0;

        this.init();
        this.animate();
        this.addEventListeners();
    }

    init() {
        this.resize();
        this.createParticles();
        this.createAsteroids();
        this.scheduleComet();
        this.scheduleShootingStar();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.8,
                vy: (Math.random() - 0.5) * 0.8,
                radius: Math.random() * 2 + 1
            });
        }
    }

    createAsteroids() {
        this.asteroids = [];
        const asteroidCount = window.innerWidth < 768 ? 2 : 4;
        for (let i = 0; i < asteroidCount; i++) {
            this.asteroids.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                radius: Math.random() * 12 + 8,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.02,
                vertices: Math.floor(Math.random() * 3) + 5
            });
        }
    }

    createComet() {
        const side = Math.floor(Math.random() * 4);
        let x, y, vx, vy;

        switch(side) {
            case 0: // top
                x = Math.random() * this.canvas.width;
                y = -50;
                vx = (Math.random() - 0.5) * 4;
                vy = Math.random() * 3 + 2;
                break;
            case 1: // right
                x = this.canvas.width + 50;
                y = Math.random() * this.canvas.height;
                vx = -(Math.random() * 3 + 2);
                vy = (Math.random() - 0.5) * 4;
                break;
            case 2: // bottom
                x = Math.random() * this.canvas.width;
                y = this.canvas.height + 50;
                vx = (Math.random() - 0.5) * 4;
                vy = -(Math.random() * 3 + 2);
                break;
            default: // left
                x = -50;
                y = Math.random() * this.canvas.height;
                vx = Math.random() * 3 + 2;
                vy = (Math.random() - 0.5) * 4;
                break;
        }

        this.comets.push({
            x, y, vx, vy,
            radius: Math.random() * 3 + 2,
            tail: [],
            maxTailLength: 30
        });
    }

    createShootingStar() {
        this.shootingStars.push({
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height * 0.4,
            vx: Math.random() * 6 + 8,
            vy: Math.random() * 6 + 8,
            opacity: 1
        });
    }

    scheduleComet() {
        this.createComet();
        setTimeout(() => this.scheduleComet(), Math.random() * 10000 + 8000);
    }

    scheduleShootingStar() {
        this.createShootingStar();
        setTimeout(() => this.scheduleShootingStar(), Math.random() * 5000 + 4000);
    }

    addEventListeners() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            // Debounce resize to avoid creating too many objects
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.resize();
                this.particleCount = window.innerWidth < 768 ? 40 : 80;
                this.createParticles();
                this.createAsteroids();
            }, 250);
        });

        this.canvas.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });

        // Click animation
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            this.clickWaves.push({
                x, y,
                radius: 0,
                opacity: 1
            });

            // Create burst particles - they become permanent stars
            for (let i = 0; i < 20; i++) {
                const angle = (Math.PI * 2 * i) / 20;
                const speed = Math.random() * 5 + 3;
                this.particles.push({
                    x, y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    radius: Math.random() * 2 + 1
                    // No lifetime - they stay forever like regular particles
                });
            }
        });
    }

    drawParticles() {
        this.particles.forEach(particle => {
            const opacity = particle.opacity !== undefined ? particle.opacity : 0.8;

            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            this.ctx.fill();

            // Glow
            const gradient = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.radius * 4
            );
            gradient.addColorStop(0, `rgba(0, 255, 255, ${opacity * 0.5})`);
            gradient.addColorStop(1, 'rgba(0, 255, 255, 0)');
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
        });
    }

    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.maxDistance) {
                    const opacity = (1 - distance / this.maxDistance) * 0.5;
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }

    drawMouseConnections() {
        if (this.mouse.x === null || this.mouse.y === null) return;

        this.particles.forEach(particle => {
            const dx = particle.x - this.mouse.x;
            const dy = particle.y - this.mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.maxDistance * 1.5) {
                const opacity = (1 - distance / (this.maxDistance * 1.5)) * 0.3;
                this.ctx.beginPath();
                this.ctx.strokeStyle = `rgba(0, 255, 255, ${opacity})`;
                this.ctx.lineWidth = 1;
                this.ctx.moveTo(particle.x, particle.y);
                this.ctx.lineTo(this.mouse.x, this.mouse.y);
                this.ctx.stroke();

                // Slight gravitational pull
                const force = (this.maxDistance * 1.5 - distance) / (this.maxDistance * 1.5);
                particle.vx -= dx * force * 0.0001;
                particle.vy -= dy * force * 0.0001;
            }
        });
    }

    drawAsteroid(asteroid) {
        this.ctx.save();
        this.ctx.translate(asteroid.x, asteroid.y);
        this.ctx.rotate(asteroid.rotation);

        this.ctx.beginPath();
        for (let i = 0; i < asteroid.vertices; i++) {
            const angle = (Math.PI * 2 * i) / asteroid.vertices;
            const radius = asteroid.radius + Math.sin(angle * 3) * 2;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        this.ctx.closePath();
        this.ctx.fillStyle = 'rgba(100, 100, 120, 0.3)';
        this.ctx.fill();
        this.ctx.strokeStyle = 'rgba(0, 255, 255, 0.4)';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();

        this.ctx.restore();
    }

    drawComet(comet) {
        // Draw tail
        if (comet.tail.length > 1) {
            this.ctx.beginPath();
            this.ctx.moveTo(comet.tail[0].x, comet.tail[0].y);

            for (let i = 1; i < comet.tail.length; i++) {
                this.ctx.lineTo(comet.tail[i].x, comet.tail[i].y);
            }

            const gradient = this.ctx.createLinearGradient(
                comet.x, comet.y,
                comet.tail[comet.tail.length - 1].x,
                comet.tail[comet.tail.length - 1].y
            );
            gradient.addColorStop(0, 'rgba(0, 255, 255, 0.8)');
            gradient.addColorStop(1, 'rgba(0, 255, 255, 0)');

            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = 3;
            this.ctx.stroke();
        }

        // Draw head
        const headGradient = this.ctx.createRadialGradient(
            comet.x, comet.y, 0,
            comet.x, comet.y, comet.radius * 2
        );
        headGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        headGradient.addColorStop(1, 'rgba(0, 255, 255, 0)');

        this.ctx.beginPath();
        this.ctx.arc(comet.x, comet.y, comet.radius * 2, 0, Math.PI * 2);
        this.ctx.fillStyle = headGradient;
        this.ctx.fill();
    }

    drawShootingStar(star) {
        const gradient = this.ctx.createLinearGradient(
            star.x, star.y,
            star.x - star.vx * 0.08, star.y - star.vy * 0.08
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
        gradient.addColorStop(1, 'rgba(0, 255, 255, 0)');

        this.ctx.beginPath();
        this.ctx.moveTo(star.x, star.y);
        this.ctx.lineTo(star.x - star.vx * 0.08, star.y - star.vy * 0.08);
        this.ctx.strokeStyle = gradient;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // Glow
        this.ctx.beginPath();
        this.ctx.arc(star.x, star.y, 3, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        this.ctx.fill();
    }

    drawClickWave(wave) {
        this.ctx.beginPath();
        this.ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
        this.ctx.strokeStyle = `rgba(0, 255, 255, ${wave.opacity})`;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.arc(wave.x, wave.y, wave.radius * 0.7, 0, Math.PI * 2);
        this.ctx.strokeStyle = `rgba(157, 78, 221, ${wave.opacity * 0.6})`;
        this.ctx.lineWidth = 1.5;
        this.ctx.stroke();
    }

    updateParticles() {
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Bounce off edges
            if (particle.x <= 0 || particle.x >= this.canvas.width) {
                particle.vx *= -1;
                particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            }
            if (particle.y <= 0 || particle.y >= this.canvas.height) {
                particle.vy *= -1;
                particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
            }

            // Add random movement
            particle.vx += (Math.random() - 0.5) * 0.02;
            particle.vy += (Math.random() - 0.5) * 0.02;

            // Limit speed
            const maxSpeed = 1;
            const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
            if (speed > maxSpeed) {
                particle.vx = (particle.vx / speed) * maxSpeed;
                particle.vy = (particle.vy / speed) * maxSpeed;
            }

            // Damping
            particle.vx *= 0.995;
            particle.vy *= 0.995;
        });
    }

    updateAsteroids() {
        this.asteroids.forEach(asteroid => {
            asteroid.x += asteroid.vx;
            asteroid.y += asteroid.vy;
            asteroid.rotation += asteroid.rotationSpeed;

            // Bounce off edges
            if (asteroid.x <= asteroid.radius || asteroid.x >= this.canvas.width - asteroid.radius) {
                asteroid.vx *= -1;
                asteroid.x = Math.max(asteroid.radius, Math.min(this.canvas.width - asteroid.radius, asteroid.x));
            }
            if (asteroid.y <= asteroid.radius || asteroid.y >= this.canvas.height - asteroid.radius) {
                asteroid.vy *= -1;
                asteroid.y = Math.max(asteroid.radius, Math.min(this.canvas.height - asteroid.radius, asteroid.y));
            }
        });
    }

    updateComets() {
        this.comets = this.comets.filter(comet => {
            comet.tail.unshift({ x: comet.x, y: comet.y });
            if (comet.tail.length > comet.maxTailLength) {
                comet.tail.pop();
            }

            comet.x += comet.vx;
            comet.y += comet.vy;

            // Remove when off screen
            return comet.x > -100 && comet.x < this.canvas.width + 100 &&
                   comet.y > -100 && comet.y < this.canvas.height + 100;
        });
    }

    updateShootingStars() {
        this.shootingStars = this.shootingStars.filter(star => {
            star.x += star.vx;
            star.y += star.vy;
            star.opacity -= 0.015;

            return star.opacity > 0 && star.y < this.canvas.height + 100;
        });
    }

    updateClickWaves() {
        this.clickWaves = this.clickWaves.filter(wave => {
            wave.radius += 3;
            wave.opacity -= 0.012; // Slower fade
            return wave.opacity > 0;
        });
    }

    animate() {
        this.time++;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update
        this.updateParticles();
        this.updateAsteroids();
        this.updateComets();
        this.updateShootingStars();
        this.updateClickWaves();

        // Draw
        this.drawConnections();
        this.drawMouseConnections();
        this.asteroids.forEach(asteroid => this.drawAsteroid(asteroid));
        this.drawParticles();
        this.comets.forEach(comet => this.drawComet(comet));
        this.shootingStars.forEach(star => this.drawShootingStar(star));
        this.clickWaves.forEach(wave => this.drawClickWave(wave));

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('constellationCanvas');
    if (canvas) {
        new UniverseBackground(canvas);
    }
});
