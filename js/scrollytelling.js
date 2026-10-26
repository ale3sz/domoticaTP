// CONFIGURACIÓN DE FOTOGRAMAS OPTIMIZADOS (70 FRAMES WEBP · 5.2 MB TOTAL)
const TOTAL_FRAMES = 70;
const frames = new Array(TOTAL_FRAMES);
const loadedSet = new Set();
let currentFrameIndex = 0;

const canvas = document.getElementById('scrolly-canvas');
const ctx = canvas.getContext('2d');

const loaderOverlay = document.getElementById('loader-overlay');
const loaderBar = document.getElementById('loader-bar');
const loaderText = document.getElementById('loader-text');
const hudProgress = document.getElementById('hud-progress-bar');
const hudStage = document.getElementById('hud-stage-name');
const hudPercent = document.getElementById('hud-percent');

// 1. CARGA PROGRESIVA INSTANTÁNEA (APPLE ARCHITECTURE)
function initInstantLoading() {
    const firstImg = new Image();
    firstImg.src = `fotogramas_sala/frame_0001.webp`;
    firstImg.onload = () => {
        frames[0] = firstImg;
        loadedSet.add(0);
        resizeCanvas();
        renderFrame(0);

        if (loaderOverlay) {
            loaderOverlay.style.opacity = '0';
            setTimeout(() => loaderOverlay.style.display = 'none', 400);
        }

        loadPriorityPass();
    };
}

function loadPriorityPass() {
    const priorityIndices = [];
    for (let i = 0; i < TOTAL_FRAMES; i += 3) {
        if (i !== 0) priorityIndices.push(i);
    }

    let pCount = 0;
    priorityIndices.forEach(idx => {
        const img = new Image();
        const padIndex = String(idx + 1).padStart(4, '0');
        img.src = `fotogramas_sala/frame_${padIndex}.webp`;
        img.onload = () => {
            frames[idx] = img;
            loadedSet.add(idx);
            pCount++;
            if (pCount >= priorityIndices.length) {
                loadRemainingFrames();
            }
        };
    });
}

function loadRemainingFrames() {
    for (let i = 0; i < TOTAL_FRAMES; i++) {
        if (!frames[i]) {
            const img = new Image();
            const padIndex = String(i + 1).padStart(4, '0');
            img.src = `fotogramas_sala/frame_${padIndex}.webp`;
            img.onload = () => {
                frames[i] = img;
                loadedSet.add(i);
            };
        }
    }
}

// 2. FUNCIÓN DE RENDERIZADO CON BÚSQUEDA DEL FOTOGRAMA MÁS CERCANO (CERO ESPERA)
function renderFrame(targetIndex) {
    let imgToDraw = frames[targetIndex];

    if (!imgToDraw || !imgToDraw.complete) {
        let bestDistance = Infinity;
        let bestIdx = 0;
        for (const loadedIdx of loadedSet) {
            const dist = Math.abs(loadedIdx - targetIndex);
            if (dist < bestDistance) {
                bestDistance = dist;
                bestIdx = loadedIdx;
            }
        }
        imgToDraw = frames[bestIdx];
    }

    if (!imgToDraw || !imgToDraw.complete) return;

    const cWidth = canvas.width;
    const cHeight = canvas.height;
    const imgWidth = imgToDraw.naturalWidth || 1600;
    const imgHeight = imgToDraw.naturalHeight || 900;

    const hRatio = cWidth / imgWidth;
    const vRatio = cHeight / imgHeight;
    const ratio = Math.max(hRatio, vRatio);

    const shiftX = (cWidth - imgWidth * ratio) / 2;
    const shiftY = (cHeight - imgHeight * ratio) / 2;

    ctx.clearRect(0, 0, cWidth, cHeight);
    ctx.drawImage(imgToDraw, 0, 0, imgWidth, imgHeight, shiftX, shiftY, imgWidth * ratio, imgHeight * ratio);
}

// 3. SINCRONIZACIÓN SUAVE CON EL SCROLL
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

            // HUD
            const pctText = Math.floor(scrollFraction * 100);
            if (hudProgress) hudProgress.style.width = `${pctText}%`;
            if (hudPercent) hudPercent.innerText = `${pctText}%`;

            updateStageLabel(scrollFraction);

            ticking = false;
        });
        ticking = true;
    }
}

function updateStageLabel(fraction) {
    if (!hudStage) return;
    if (fraction < 0.18) {
        hudStage.innerText = "01 // ¿QUÉ ES LA DOMÓTICA? (ARQUITECTURA DEL HOGAR)";
    } else if (fraction < 0.38) {
        hudStage.innerText = "02 // ENTRADA DE DATOS (SENSORES VS USUARIOS)";
    } else if (fraction < 0.58) {
        hudStage.innerText = "03 // CANALES DE COMUNICACIÓN (WI-FI VS ZIGBEE MALLA)";
    } else if (fraction < 0.78) {
        hudStage.innerText = "04 // GESTIÓN & ALMACENAMIENTO (EDGE VS NUBE)";
    } else if (fraction < 0.92) {
        hudStage.innerText = "05 // CIBERSEGURIDAD & PRIVACIDAD (SUPERFICIE DE ATAQUE)";
    } else {
        hudStage.innerText = "06 // SISTEMAS DE INFORMACIÓN & REFLEXIÓN ÉTICA";
    }
}

// 4. FUNCIONES DE AMPLIACIÓN DE IMÁGENES (LIGHTBOX)
function openLightbox(src, caption) {
    const modal = document.getElementById('lightbox-modal');
    const img = document.getElementById('lightbox-img');
    const cap = document.getElementById('lightbox-caption');
    if (modal && img) {
        img.src = src;
        if (cap) cap.innerText = caption || '';
        modal.classList.remove('hidden');
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeLightbox() {
    const modal = document.getElementById('lightbox-modal');
    if (modal) {
        modal.classList.remove('active');
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

// 5. NAVEGACIÓN FLUIDA POR TECLADO
window.addEventListener('keydown', (e) => {
    // Cerrar imagen en pantalla completa con ESC
    if (e.key === 'Escape') {
        closeLightbox();
        return;
    }

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

// 5. RESPONSIVE
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    renderFrame(currentFrameIndex);
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('scroll', onScroll, { passive: true });

initInstantLoading();
window.addEventListener('DOMContentLoaded', () => {
    resizeCanvas();
    if (typeof lucide !== 'undefined') lucide.createIcons();
});
