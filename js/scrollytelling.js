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
// Cargamos el primer fotograma de inmediato para desbloquear la pantalla en menos de 0.2s.
function initInstantLoading() {
    // A) Cargar Frame 1 prioritario
    const firstImg = new Image();
    firstImg.src = `fotogramas_sala/frame_0001.webp`;
    firstImg.onload = () => {
        frames[0] = firstImg;
        loadedSet.add(0);
        resizeCanvas();
        renderFrame(0);

        // Desbloquear pantalla INMEDIATAMENTE
        if (loaderOverlay) {
            loaderOverlay.style.opacity = '0';
            setTimeout(() => loaderOverlay.style.display = 'none', 400);
        }

        // B) Iniciar carga prioritaria de hitos (cada 3 frames)
        loadPriorityPass();
    };
}

function loadPriorityPass() {
    // Paso 1: Hitos clave para cubrir todo el recorrido de inmediato
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
                // Paso 2: Cargar el resto de frames en segundo plano silencioso
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

    // Si el fotograma exacto aún se está descargando, buscar el más cercano ya disponible
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
        hudStage.innerText = "PARTE 1 / 4 // INTRODUCCIÓN Y ARQUITECTURA (DÍA)";
    } else if (fraction < 0.38) {
        hudStage.innerText = "PARTE 2 / 4 // ENTRADA DE DATOS & SENSORES (ATARDECER)";
    } else if (fraction < 0.58) {
        hudStage.innerText = "PARTE 2 / 4 // TRANSMISIÓN: WI-FI VS ZIGBEE (ATARDECER)";
    } else if (fraction < 0.78) {
        hudStage.innerText = "PARTE 3 / 4 // GESTIÓN EN NUBE & FLUJO (ANOCHECER)";
    } else if (fraction < 0.92) {
        hudStage.innerText = "PARTE 3 / 4 // CIBERSEGURIDAD & PRIVACIDAD (NOCHE)";
    } else {
        hudStage.innerText = "PARTE 4 / 4 // SISTEMAS DE INFORMACIÓN & CIERRE (NOCHE)";
    }
}

// 4. FUNCIONES DE APOYO A LA EXPOSICIÓN ORAL
function scrollToSection(sectionId) {
    const el = document.getElementById(sectionId);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
    }
}

function toggleSpeakerNotes() {
    const notes = document.querySelectorAll('.speaker-notes');
    const btn = document.getElementById('toggle-notes-btn');
    let isHidden = false;
    notes.forEach(n => {
        n.classList.toggle('hidden-notes');
        isHidden = n.classList.contains('hidden-notes');
    });
    if (btn) {
        if (isHidden) {
            btn.classList.remove('bg-emerald-400/15', 'text-emerald-300', 'border-emerald-400/40');
            btn.classList.add('bg-white/5', 'text-slate-400', 'border-white/10');
        } else {
            btn.classList.add('bg-emerald-400/15', 'text-emerald-300', 'border-emerald-400/40');
            btn.classList.remove('bg-white/5', 'text-slate-400', 'border-white/10');
        }
    }
}

function openImageModal(src, caption) {
    const modal = document.getElementById('image-modal');
    const img = document.getElementById('modal-img-element');
    const cap = document.getElementById('modal-caption-element');
    if (modal && img) {
        img.src = src;
        if (cap) cap.innerText = caption || '';
        modal.classList.add('active');
    }
}

function closeImageModal() {
    const modal = document.getElementById('image-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// 5. NAVEGACIÓN Y ATAJOS DE TECLADO PARA EXPONER
window.addEventListener('keydown', (e) => {
    // Escape para cerrar modal
    if (e.key === 'Escape') {
        closeImageModal();
        return;
    }

    // Tecla 'G' para alternar notas de orador
    if (e.key === 'g' || e.key === 'G') {
        toggleSpeakerNotes();
        return;
    }

    // Teclas 1, 2, 3, 4 para saltar directo a cada parte
    if (e.key === '1') { scrollToSection('seccion-1'); return; }
    if (e.key === '2') { scrollToSection('seccion-2'); return; }
    if (e.key === '3') { scrollToSection('seccion-4'); return; }
    if (e.key === '4') { scrollToSection('seccion-6'); return; }

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

// Arrancar inmediatamente
initInstantLoading();
window.addEventListener('DOMContentLoaded', () => {
    resizeCanvas();
    if (typeof lucide !== 'undefined') lucide.createIcons();
});
