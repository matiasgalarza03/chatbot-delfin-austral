// Funcionalidad del fondo animado del océano
class OceanBackground {
    constructor(containerId = 'ocean-background') {
        this.container = document.getElementById(containerId);
        this.particleCount = 0;
        this.bubbleCount = 0;
        this.maxParticles = 200; // Increased number of particles
        this.maxBubbles = 80;    // Increased number of bubbles
        this.waves = [];         // To track active wave effects
        this.init();
    }

    init() {
        if (!this.container) {
            console.warn('No se encontró el contenedor del fondo del océano');
            return;
        }

        this.setupEventListeners();
        this.startAnimations();
        this.setupCursor();
        // Eliminado: No crear patrones abstractos (manchas azules)
    }

    setupEventListeners() {
        // Create waves on click with enhanced effect
        document.addEventListener('click', (e) => {
            this.createClickWave(e.clientX, e.clientY);
            // Create multiple particles on click with spread
            const particlesCount = 15 + Math.floor(Math.random() * 10);
            for (let i = 0; i < particlesCount; i++) {
                setTimeout(() => {
                    const angle = (i / particlesCount) * Math.PI * 2;
                    const distance = 10 + Math.random() * 30;
                    const x = e.clientX + Math.cos(angle) * distance;
                    const y = e.clientY + Math.sin(angle) * distance;
                    this.createParticle(x, y, true);
                }, i * 50);
            }
        });

        // Crear partículas al mover el mouse
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
        // Generar elementos continuamente con mayor frecuencia
        setInterval(() => this.createBubble(true), 400); // Mucho más frecuente y arriba
        setInterval(() => this.createParticle(true), 180); // Mucho más frecuente y arriba
        setInterval(() => this.createFloatingParticle(), 600); // Nuevo tipo
        setInterval(() => this.createSparkle(), 1200); // Nuevo efecto

        // Crear elementos iniciales
        for (let i = 0; i < 40; i++) {
            setTimeout(() => this.createBubble(true), i * 120);
            setTimeout(() => this.createParticle(true), i * 80);
            setTimeout(() => this.createFloatingParticle(), i * 200);
            setTimeout(() => this.createSparkle(), i * 300);
        }
    }

    setupCursor() {
        const cursorGlow = this.container.querySelector('.cursor-glow');
        let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
        let currentX = mouseX, currentY = mouseY;
        let isMouseInside = false;
        let animationFrameId;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            isMouseInside = true;
            if (cursorGlow) cursorGlow.style.opacity = '1';

            // Efecto de movimiento del fondo basado en la posición del mouse (mejorado)
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }

            animationFrameId = requestAnimationFrame(() => {
                const waves = this.container.querySelectorAll('.wave');
                const mouseXPercent = e.clientX / window.innerWidth;
                const mouseYPercent = e.clientY / window.innerHeight;

                waves.forEach((wave, index) => {
                    const intensity = (index + 1) * 0.5; // Aumentado
                    const offsetX = (mouseXPercent - 0.5) * intensity * 20; // Más movimiento
                    const offsetY = (mouseYPercent - 0.5) * intensity * 10; // Más movimiento

                    const baseTransform = wave.style.transform || '';
                    const newTransform = baseTransform.replace(/translateX\([^)]*\)|translateY\([^)]*\)/g, '');
                    wave.style.transform = `${newTransform} translateX(${offsetX}%) translateY(${offsetY}px)`.trim();
                });

                // Mover partículas y burbujas con el mouse
                const particles = this.container.querySelectorAll('.particle, .floating-particle, .sparkle');
                particles.forEach(particle => {
                    const rect = particle.getBoundingClientRect();
                    const particleX = rect.left + rect.width / 2;
                    const particleY = rect.top + rect.height / 2;
                    const distance = Math.sqrt(Math.pow(mouseX - particleX, 2) + Math.pow(mouseY - particleY, 2));
                    
                    if (distance < 150) {
                        const angle = Math.atan2(mouseY - particleY, mouseX - particleX);
                        const force = (150 - distance) / 150;
                        const moveX = Math.cos(angle) * force * 2;
                        const moveY = Math.sin(angle) * force * 2;
                        
                        particle.style.transform += ` translateX(${moveX}px) translateY(${moveY}px)`;
                    }
                });
            });
        });

        document.addEventListener('mouseleave', () => {
            isMouseInside = false;
            if (cursorGlow) cursorGlow.style.opacity = '0';
        });

        document.addEventListener('mouseenter', () => {
            isMouseInside = true;
            if (cursorGlow) cursorGlow.style.opacity = '1';
        });

        // Animación suave del cursor
        const animateCursor = () => {
            if (isMouseInside && cursorGlow) {
                currentX += (mouseX - currentX) * 0.2; // Más responsivo
                currentY += (mouseY - currentY) * 0.2;
                cursorGlow.style.transform = `translate(${currentX - 100}px, ${currentY - 100}px)`;
            }
            requestAnimationFrame(animateCursor);
        };

        animateCursor();
    }

    createBubble(topOnly = false) {
        if (this.bubbleCount >= this.maxBubbles) return;
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        const size = Math.random() * 80 + 15;
        bubble.style.width = size + 'px';
        bubble.style.height = size + 'px';
        bubble.style.left = Math.random() * 100 + '%';
        if (topOnly) {
            bubble.style.top = Math.random() * 25 + '%'; // Solo parte superior
        }
        bubble.style.animationDuration = (Math.random() * 8 + 8) + 's';
        bubble.style.animationDelay = Math.random() * 3 + 's';
        this.container.querySelector('.ocean-container').appendChild(bubble);
        this.bubbleCount++;
        setTimeout(() => {
            if (bubble.parentNode) {
                bubble.remove();
                this.bubbleCount--;
            }
        }, 16000);
    }

    createParticle(x = null, y = null, fromClick = false) {
        if (this.particleCount >= this.maxParticles) return;
        
        const particle = document.createElement('div');
        particle.className = Math.random() > 0.7 ? 'floating-particle' : 'particle';
        
        // Position the particle
        if (x && y) {
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
        } else {
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 20 + '%'; // Mostly from top
        }

        // Random size and animation
        const size = fromClick ? 2 + Math.random() * 4 : 1 + Math.random() * 3;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        const duration = (Math.random() * 15 + 10) + 's';
        particle.style.animationDuration = duration;
        particle.style.animationDelay = (Math.random() * 5) + 's';
        
        // Add to DOM
        this.container.querySelector('.ocean-container').appendChild(particle);
        this.particleCount++;

        // Auto-remove after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.style.opacity = '0';
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.remove();
                        this.particleCount--;
                    }

            waves.forEach((wave, index) => {
                const intensity = (index + 1) * 0.5; // Aumentado
                const offsetX = (mouseXPercent - 0.5) * intensity * 20; // Más movimiento
                const offsetY = (mouseYPercent - 0.5) * intensity * 10; // Más movimiento

                const baseTransform = wave.style.transform || '';
                const newTransform = baseTransform.replace(/translateX\([^)]*\)|translateY\([^)]*\)/g, '');
                wave.style.transform = `${newTransform} translateX(${offsetX}%) translateY(${offsetY}px)`.trim();
            });

            // Mover partículas y burbujas con el mouse
            const particles = this.container.querySelectorAll('.particle, .floating-particle, .sparkle');
            particles.forEach(particle => {
                const rect = particle.getBoundingClientRect();
                const particleX = rect.left + rect.width / 2;
                const particleY = rect.top + rect.height / 2;
                const distance = Math.sqrt(Math.pow(mouseX - particleX, 2) + Math.pow(mouseY - particleY, 2));
                
                if (distance < 150) {
                    const angle = Math.atan2(mouseY - particleY, mouseX - particleX);
                    const force = (150 - distance) / 150;
                    const moveX = Math.cos(angle) * force * 2;
                    const moveY = Math.sin(angle) * force * 2;
                    
                    particle.style.transform += ` translateX(${moveX}px) translateY(${moveY}px)`;
                }
            });
        });
    });

    document.addEventListener('mouseleave', () => {
        isMouseInside = false;
        if (cursorGlow) cursorGlow.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        isMouseInside = true;
        if (cursorGlow) cursorGlow.style.opacity = '1';
    });

    // Animación suave del cursor
    const animateCursor = () => {
        if (isMouseInside && cursorGlow) {
            currentX += (mouseX - currentX) * 0.2; // Más responsivo
            currentY += (mouseY - currentY) * 0.2;
            cursorGlow.style.transform = `translate(${currentX - 100}px, ${currentY - 100}px)`;
        }
        requestAnimationFrame(animateCursor);
    };

    animateCursor();
}

createBubble(topOnly = false) {
    if (this.bubbleCount >= this.maxBubbles) return;
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    const size = Math.random() * 80 + 15;
    bubble.style.width = size + 'px';
    bubble.style.height = size + 'px';
    bubble.style.left = Math.random() * 100 + '%';
    if (topOnly) {
        bubble.style.top = Math.random() * 25 + '%'; // Solo parte superior
    }
    bubble.style.animationDuration = (Math.random() * 8 + 8) + 's';
    bubble.style.animationDelay = Math.random() * 3 + 's';
    this.container.querySelector('.ocean-container').appendChild(bubble);
    this.bubbleCount++;
    setTimeout(() => {
        if (bubble.parentNode) {
            bubble.remove();
            this.bubbleCount--;
        }
    }, 16000);
}

createParticle(x = null, y = null, fromClick = false) {
    if (this.particleCount >= this.maxParticles) return;
    
    const particle = document.createElement('div');
    particle.className = Math.random() > 0.7 ? 'floating-particle' : 'particle';
    
    // Position the particle
    if (x && y) {
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
    } else {
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 20 + '%'; // Mostly from top
    }

    // Random size and animation
    const size = fromClick ? 2 + Math.random() * 4 : 1 + Math.random() * 3;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    
    const duration = (Math.random() * 15 + 10) + 's';
    particle.style.animationDuration = duration;
    particle.style.animationDelay = (Math.random() * 5) + 's';
    
    // Add to DOM
    this.container.querySelector('.ocean-container').appendChild(particle);
    this.particleCount++;

    // Auto-remove after animation
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
        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.animationDuration = (Math.random() * 3 + 2) + 's';
        sparkle.style.animationDelay = Math.random() * 2 + 's';

        this.container.querySelector('.ocean-container').appendChild(sparkle);

        setTimeout(() => {
            if (sparkle.parentNode) {
                sparkle.remove();
            }
        }, 5000);
    }

    createRipple(x, y) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        ripple.style.animation = 'ripple-expand 2s ease-out';

        this.container.querySelector('.ocean-container').appendChild(ripple);

        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.remove();
            }
        }, 2000);
    }

    // Método para destruir/limpiar la instancia
    destroy() {
        // Limpiar intervalos y event listeners si es necesario
        const elements = this.container.querySelectorAll('.bubble, .particle, .floating-particle, .sparkle, .ripple, .abstract-pattern');
        elements.forEach(el => el.remove());
    }
}

// Auto-inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('ocean-background')) {
        window.oceanBackground = new OceanBackground();
    }
});