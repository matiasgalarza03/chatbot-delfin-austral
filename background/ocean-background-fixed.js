// Ocean Background with enhanced effects
class OceanBackground {
    constructor(containerId = 'ocean-background') {
        this.container = document.getElementById(containerId);
        this.particleCount = 0;
        this.bubbleCount = 0;
        this.maxParticles = 200;
        this.maxBubbles = 80;
        this.waves = [];
        this.init();
    }

    init() {
        if (!this.container) {
            console.warn('Ocean background container not found');
            return;
        }

        this.setupEventListeners();
        this.startAnimations();
        this.setupCursor();
    }

    setupEventListeners() {
        // Enhanced click effect
        document.addEventListener('click', (e) => {
            this.createClickWave(e.clientX, e.clientY);
            
            // Create particle burst on click
            const particlesCount = 15 + Math.floor(Math.random() * 10);
            for (let i = 0; i < particlesCount; i++) {
                setTimeout(() => {
                    const angle = (i / particlesCount) * Math.PI * 2;
                    const distance = 10 + Math.random() * 30;
                    const x = e.clientX + Math.cos(angle) * distance;
                    const y = e.clientY + Math.sin(angle) * distance;
                    this.createParticle(x, y, true);
                }, i * 30);
            }
        });

        // Particle generation on mouse move
        let mouseMoveTimeout;
        document.addEventListener('mousemove', (e) => {
            if (mouseMoveTimeout) clearTimeout(mouseMoveTimeout);
            mouseMoveTimeout = setTimeout(() => {
                if (Math.random() > 0.7) {
                    this.createParticle(e.clientX, e.clientY);
                }
            }, 50);
        });
    }

    startAnimations() {
        // Generate elements at different intervals
        setInterval(() => this.createBubble(true), 400);
        setInterval(() => this.createParticle(), 180);
        setInterval(() => this.createFloatingParticle(), 600);
        setInterval(() => this.createSparkle(), 1200);
        setInterval(() => this.createAscendingParticle(), 80); // More frequent ascending particles

        // Initial elements
        for (let i = 0; i < 40; i++) {
            setTimeout(() => this.createBubble(true), i * 120);
            setTimeout(() => this.createParticle(), i * 80);
            setTimeout(() => this.createFloatingParticle(), i * 200);
            setTimeout(() => this.createSparkle(), i * 300);
            setTimeout(() => this.createAscendingParticle(), i * 50);
        }
    }

    setupCursor() {
        const cursorGlow = document.createElement('div');
        cursorGlow.className = 'cursor-glow';
        this.container.appendChild(cursorGlow);

        this.mouseX = window.innerWidth / 2;
        this.mouseY = window.innerHeight / 2;
        this.currentX = this.mouseX;
        this.currentY = this.mouseY;
        this.isMouseInside = true;
        this.cursorRadius = 100; // Area of effect radius

        // Store active particles for physics
        this.activeParticles = new Set();

        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            cursorGlow.classList.add('visible');
            
            // Show cursor glow with delay
            clearTimeout(this.cursorHideTimeout);
            this.cursorHideTimeout = setTimeout(() => {
                cursorGlow.classList.remove('visible');
            }, 300);
            
            // Update particle physics
            this.updateParticlePhysics();
        });

        document.addEventListener('mouseleave', () => {
            cursorGlow.classList.remove('visible');
            this.isMouseInside = false;
        });

        document.addEventListener('mouseenter', () => {
            cursorGlow.classList.add('visible');
            this.isMouseInside = true;
        });

        let currentX = 0;
        let currentY = 0;
        let mouseX = 0;
        let mouseY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        const animateCursor = () => {
            if (this.isMouseInside) {
                currentX += (mouseX - currentX) * 0.2;
                currentY += (mouseY - currentY) * 0.2;
                cursorGlow.style.transform = `translate(${currentX - 150}px, ${currentY - 150}px)`;
            }
            requestAnimationFrame(animateCursor);
        };
        animateCursor();
    }

    createClickWave(x, y) {
        const wave = document.createElement('div');
        wave.className = 'click-wave';
        wave.style.left = x + 'px';
        wave.style.top = y + 'px';
        
        const size = 30 + Math.random() * 50;
        wave.style.width = size + 'px';
        wave.style.height = size + 'px';
        
        this.container.querySelector('.ocean-container').appendChild(wave);
        this.waves.push(wave);
        
        setTimeout(() => {
            if (wave.parentNode) {
                wave.remove();
                this.waves = this.waves.filter(w => w !== wave);
            }
        }, 2000);
        
        this.pushParticlesAway(x, y, 150, 5);
    }
    
    pushParticlesAway(centerX, centerY, radius, force) {
        const particles = this.container.querySelectorAll('.particle, .floating-particle');
        particles.forEach(particle => {
            const rect = particle.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            const dx = x - centerX;
            const dy = y - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < radius) {
                const angle = Math.atan2(dy, dx);
                const pushForce = (1 - distance / radius) * force;
                const translateX = Math.cos(angle) * pushForce * 10;
                const translateY = Math.sin(angle) * pushForce * 10;
                
                particle.style.transform = `translate(${translateX}px, ${translateY}px)`;
                
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.style.transition = 'transform 0.5s ease-out';
                        particle.style.transform = 'translate(0, 0)';
                        
                        setTimeout(() => {
                            if (particle.parentNode) {
                                particle.style.transition = '';
                            }
                        }, 500);
                    }
                }, 50);
            }
        });
    }

    createParticle(x = null, y = null, fromClick = false) {
        if (this.particleCount >= this.maxParticles) return;
        
        const particle = document.createElement('div');
        particle.className = Math.random() > 0.7 ? 'floating-particle' : 'particle';
        
        if (x && y) {
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
        } else {
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 20 + '%';
        }

        const size = fromClick ? 2 + Math.random() * 4 : 1 + Math.random() * 3;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        const duration = (Math.random() * 15 + 10) + 's';
        particle.style.animationDuration = duration;
        particle.style.animationDelay = (Math.random() * 5) + 's';
        
        this.container.querySelector('.ocean-container').appendChild(particle);
        this.particleCount++;

        setTimeout(() => {
            if (particle.parentNode) {
                particle.style.opacity = '0';
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.remove();
                        this.particleCount--;
                    }
                }, 1000);
            }
        }, parseFloat(duration) * 1000);
    }

    createFloatingParticle() {
        if (this.particleCount >= this.maxParticles) return;
        
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 20 + '%';
        particle.style.animationDuration = (Math.random() * 12 + 10) + 's';
        particle.style.animationDelay = (Math.random() * 8) + 's';
        
        this.container.querySelector('.ocean-container').appendChild(particle);
        this.particleCount++;
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.style.opacity = '0';
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.remove();
                        this.particleCount--;
                    }
                }, 1000);
            }
        }, 20000);
    }

    createSparkle() {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.top = Math.random() * 100 + '%';
        sparkle.style.animationDuration = (Math.random() * 3 + 2) + 's';
        sparkle.style.animationDelay = (Math.random() * 2) + 's';
        
        this.container.querySelector('.ocean-container').appendChild(sparkle);
        
        setTimeout(() => {
            if (sparkle.parentNode) {
                sparkle.remove();
            }
        }, 5000);
    }

    createAscendingParticle() {
        if (this.particleCount >= this.maxParticles) return;
        
        const particle = document.createElement('div');
        particle.className = 'ascending-particle';
        
        // Random size between 1px and 4px
        const size = 1 + Math.random() * 3;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // Position at bottom of screen with random horizontal position
        const startX = Math.random() * window.innerWidth;
        particle.style.left = startX + 'px';
        particle.style.bottom = '0px';
        
        // Store initial position and velocity
        particle.velocity = {
            x: (Math.random() - 0.5) * 0.2, // Slight horizontal movement
            y: -0.2 - Math.random() * 0.5,  // Upward movement
            baseY: -0.2 - Math.random() * 0.5 // Base upward velocity
        };
        
        particle.position = {
            x: startX,
            y: window.innerHeight
        };
        
        // Random opacity for variation
        particle.opacity = 0.4 + Math.random() * 0.6;
        particle.style.opacity = particle.opacity;
        
        // Random animation duration between 10s and 20s
        const duration = 10 + Math.random() * 10;
        particle.style.transition = 'transform 0.1s linear, opacity 0.5s ease';
        
        // Add to DOM and active particles set
        this.container.querySelector('.ocean-container').appendChild(particle);
        this.activeParticles.add(particle);
        this.particleCount++;
        
        // Auto-remove after animation
        particle.timeout = setTimeout(() => {
            if (particle.parentNode) {
                particle.remove();
                this.activeParticles.delete(particle);
                this.particleCount--;
            }
        }, (duration + 2) * 1000);
    }
    
    createBubble(topOnly = false) {
        if (this.bubbleCount >= this.maxBubbles) return;
        
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        
        const size = Math.random() * 30 + 10;
        bubble.style.width = size + 'px';
        bubble.style.height = size + 'px';
        bubble.style.left = Math.random() * 100 + '%';
        
        if (topOnly) {
            bubble.style.top = Math.random() * 25 + '%';
        } else {
            bubble.style.top = '100%';
        }
        
        bubble.style.animationDuration = (Math.random() * 8 + 12) + 's';
        bubble.style.animationDelay = (Math.random() * 3) + 's';
        
        this.container.querySelector('.ocean-container').appendChild(bubble);
        // Auto-remove after animation
        bubble.timeout = setTimeout(() => {
            if (bubble.parentNode) {
                bubble.remove();
                this.bubbleCount--;
            }
        }, 10000);
    }
    
    updateParticlePhysics() {
        if (!this.activeParticles || !this.activeParticles.size) return;
        
        const cursorX = this.mouseX;
        const cursorY = this.mouseY;
        const cursorRadius = this.cursorRadius;
        const cursorRadiusSq = cursorRadius * cursorRadius;
        const repulsionStrength = 0.5;
        
        this.activeParticles.forEach(particle => {
            // Skip if particle is being removed
            if (!particle.parentNode) {
                this.activeParticles.delete(particle);
                return;
            }
            
            // Get current position
            const rect = particle.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            
            // Calculate distance to cursor
            const dx = x - cursorX;
            const dy = y - cursorY;
            const distanceSq = dx * dx + dy * dy;
            
            // If particle is within cursor radius
            if (distanceSq < cursorRadiusSq) {
                const distance = Math.sqrt(distanceSq);
                const force = (1 - distance / cursorRadius) * repulsionStrength;
                const angle = Math.atan2(dy, dx);
                
                // Apply repulsion force
                particle.velocity.x += Math.cos(angle) * force * 2;
                particle.velocity.y += Math.sin(angle) * force * 2;
                
                // Add some turbulence
                particle.velocity.x += (Math.random() - 0.5) * 0.2;
                particle.velocity.y -= Math.random() * 0.1;
                
                // Make particles more visible when near cursor
                particle.style.opacity = Math.min(1, particle.opacity * 1.5);
            } else {
                // Reset to base velocity with some random movement
                particle.velocity.x += (Math.random() - 0.5) * 0.01;
                particle.velocity.y = particle.velocity.baseY + (Math.random() - 0.5) * 0.05;
                
                // Reset opacity
                particle.style.opacity = particle.opacity;
            }
            
            // Apply damping to velocity
            particle.velocity.x *= 0.95;
            
            // Update position
            particle.position.x += particle.velocity.x;
            particle.position.y += particle.velocity.y;
            
            // Apply position with transform for better performance
            particle.style.transform = `translate(${particle.position.x}px, ${particle.position.y}px)`;
        });
        
        // Continue animation
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        this.animationFrameId = requestAnimationFrame(() => this.updateParticlePhysics());
    }
    
    // Clean up
    destroy() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        clearTimeout(this.cursorHideTimeout);
        if (this.activeParticles) {
            this.activeParticles.forEach(particle => {
                clearTimeout(particle.timeout);
                if (particle.parentNode) {
                    particle.remove();
                }
            });
            this.activeParticles.clear();
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('ocean-background')) {
        window.oceanBackground = new OceanBackground();
    }
});
