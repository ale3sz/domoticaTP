// CONFIGURACIÓN DE FOTOGRAMAS
const TOTAL_FRAMES = 100;
const frames = [];
let loadedCount = 0;
let currentFrameIndex = 0;

const canvas = document.getElementById('scrolly-canvas');
const ctx = canvas.getContext('2d');

const loaderOverlay = document.getElementById('loader-overlay');
const loaderBar = document.getElementById('loader-bar');
const loaderText = document.getElementById('loader-text');
const hudProgress = document.getElementById('hud-progress-bar');
const hudStage = document.getElementById('hud-stage-name');
const hudPercent = document.getElementById('hud-percent');

// 1. CARGA PROGRESIVA DE LOS 100 FOTOGRAMAS
function preloadFrames() {
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
        const img = new Image();
        const padIndex = String(i).padStart(4, '0');
        img.src = `fotogramas_sala/frame_${padIndex}.jpg`;

        img.onload = () => {
            loadedCount++;
            const pct = Math.floor((loadedCount / TOTAL_FRAMES) * 100);
            if (loaderBar) loaderBar.style.width = `${pct}%`;
            if (loaderText) loaderText.innerText = `Cargando fotogramas de la sala... ${pct}%`;

            if (loadedCount === 1) {
                // Dibujar el primer cuadro de inmediato apenas esté listo
                resizeCanvas();
                renderFrame(0);
            }

            if (loadedCount >= TOTAL_FRAMES) {
                setTimeout(() => {
                    if (loaderOverlay) {
                        loaderOverlay.style.opacity = '0';
                        setTimeout(() => loaderOverlay.style.visibility = 'hidden', 600);
                    }
                }, 300);
            }
        };

        img.onerror = () => {
            console.warn(`Error al cargar el frame ${padIndex}`);
            loadedCount++;
        };

        frames.push(img);
    }
}

// 2. RENDERIZADO DEL FRAME CON AJUSTE COVER (RESPONSIVE)
function renderFrame(index) {
    if (!frames[index] || !frames[index].complete) return;
    const img = frames[index];

    const cWidth = canvas.width;
    const cHeight = canvas.height;

    const imgWidth = img.naturalWidth || 1920;
    const imgHeight = img.naturalHeight || 1080;

    const hRatio = cWidth / imgWidth;
    const vRatio = cHeight / imgHeight;
    const ratio = Math.max(hRatio, vRatio);

    const shiftX = (cWidth - imgWidth * ratio) / 2;
    const shiftY = (cHeight - imgHeight * ratio) / 2;

    ctx.clearRect(0, 0, cWidth, cHeight);
    ctx.drawImage(img, 0, 0, imgWidth, imgHeight, shiftX, shiftY, imgWidth * ratio, imgHeight * ratio);
}

// 3. SINCRONIZACIÓN CON EL SCROLL (SCROLLYTELLING ENGINE)
let ticking = false;

function onScroll() {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const maxScroll = (document.documentElement.scrollHeight - window.innerHeight) || 1;
            const scrollFraction = Math.min(1, Math.max(0, scrollTop / maxScroll));

            const frameIndex = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.floor(scrollFraction * TOTAL_FRAMES)));
            
            if (frameIndex !== currentFrameIndex) {
                currentFrameIndex = frameIndex;
                renderFrame(currentFrameIndex);
            }

            // Actualizar HUD de progreso
            const pctText = Math.floor(scrollFraction * 100);
            if (hudProgress) hudProgress.style.width = `${pctText}%`;
            if (hudPercent) hudPercent.innerText = `${pctText}%`;

            updateStageLabel(scrollFraction);

            ticking = false;
        });
        ticking = true;
    }
}

// Etapas según el porcentaje del video
function updateStageLabel(fraction) {
    if (!hudStage) return;
    if (fraction < 0.20) {
        hudStage.innerText = "01 // ¿QUÉ ES LA DOMÓTICA? (DÍA)";
    } else if (fraction < 0.40) {
        hudStage.innerText = "02 // ENTRADA: SENSORES DE LUZ & PRESENCIA";
    } else if (fraction < 0.60) {
        hudStage.innerText = "03 // TRANSMISIÓN: WI-FI VS ZIGBEE MALLA";
    } else if (fraction < 0.80) {
        hudStage.innerText = "04 // PROCESAMIENTO: HUB EDGE VS NUBE";
    } else if (fraction < 0.95) {
        hudStage.innerText = "05 // CIBERSEGURIDAD & PRIVACIDAD (NOCHE)";
    } else {
        hudStage.innerText = "06 // CONCLUSIÓN: EL ROL DEL SOFTWARE";
    }
}

// 4. CONTROL CON FLECHAS DEL TECLADO PARA LA PRESENTACIÓN
window.addEventListener('keydown', (e) => {
    const sections = document.querySelectorAll('.story-section');
    const scrollPos = window.scrollY;

    if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        for (let i = 0; i < sections.length; i++) {
            const top = sections[i].offsetTop;
            if (top > scrollPos + 50) {
                e.preventDefault();
                window.scrollTo({ top, behavior: 'smooth' });
                break;
            }
        }
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        for (let i = sections.length - 1; i >= 0; i--) {
            const top = sections[i].offsetTop;
            if (top < scrollPos - 50) {
                e.preventDefault();
                window.scrollTo({ top, behavior: 'smooth' });
                break;
            }
        }
    }
});

// 5. AJUSTE RESPONSIVE DEL CANVAS
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    renderFrame(currentFrameIndex);
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('scroll', onScroll, { passive: true });

// Inicialización
preloadFrames();
window.addEventListener('DOMContentLoaded', () => {
    resizeCanvas();
    if (typeof lucide !== 'undefined') lucide.createIcons();
});
