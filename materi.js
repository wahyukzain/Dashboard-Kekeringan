// Interactive Material Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== EXPANDABLE TYPE CARDS =====
    const typeCards = document.querySelectorAll('.type-card');
    
    typeCards.forEach(card => {
        const expandBtn = card.querySelector('.expand-btn');
        
        if (expandBtn) {
            expandBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                card.classList.toggle('expanded');
            });
        }
        
        // Also allow clicking the whole card to expand
        card.addEventListener('click', function() {
            card.classList.toggle('expanded');
        });
    });
    
    // ===== SMOOTH SCROLL FOR INTERNAL LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // ===== SCROLL ANIMATION OBSERVER =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animation
    const animatedElements = document.querySelectorAll('.type-card, .visual-diagram, .factor-block, .data-table-section, .strategy-block, .adaptation-block');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
    
    // ===== IMAGE LIGHTBOX WITH ZOOM IN / ZOOM OUT =====
    const images = document.querySelectorAll(
        '.visual-diagram img, .factor-visual img, .karst-visual img, ' +
        '.strategy-visual img, .adaptation-visual img, .wisdom-visual-center img, ' +
        '.comparison-visual img, .geo-card img, .type-card img, .type-detail img, ' +
        '.map-hd-img'
    );

    // Inject lightbox CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes lbFadeIn {
            from { opacity: 0; }
            to   { opacity: 1; }
        }
        @keyframes lbFadeOut {
            from { opacity: 1; }
            to   { opacity: 0; }
        }
        @keyframes lbZoomIn {
            from { transform: scale(0.85); opacity: 0; }
            to   { transform: scale(1);    opacity: 1; }
        }

        /* Overlay */
        #img-lightbox {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.92);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 99999;
            animation: lbFadeIn 0.3s ease;
            backdrop-filter: blur(6px);
        }
        #img-lightbox.lb-closing {
            animation: lbFadeOut 0.28s ease forwards;
        }

        /* Toolbar */
        #lb-toolbar {
            position: fixed;
            top: 18px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            align-items: center;
            gap: 8px;
            background: rgba(255,255,255,0.12);
            border: 1px solid rgba(255,255,255,0.2);
            padding: 8px 18px;
            border-radius: 50px;
            backdrop-filter: blur(12px);
            z-index: 100001;
            user-select: none;
        }
        .lb-btn {
            background: rgba(255,255,255,0.15);
            border: 1px solid rgba(255,255,255,0.3);
            color: #fff;
            width: 38px;
            height: 38px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s, transform 0.15s;
        }
        .lb-btn:hover {
            background: rgba(0,188,212,0.55);
            transform: scale(1.12);
        }
        .lb-btn:active { transform: scale(0.94); }
        #lb-zoom-label {
            color: #fff;
            font-family: 'Inter', sans-serif;
            font-size: 0.85rem;
            min-width: 48px;
            text-align: center;
            font-weight: 700;
            letter-spacing: 0.5px;
        }

        /* Close button */
        #lb-close-btn {
            position: fixed;
            top: 18px;
            right: 24px;
            background: rgba(220,38,38,0.75);
            border: none;
            color: #fff;
            width: 42px;
            height: 42px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 1.3rem;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 100002;
            transition: background 0.2s, transform 0.15s;
        }
        #lb-close-btn:hover { background: rgba(220,38,38,1); transform: scale(1.1); }

        /* Image wrapper (for panning) */
        #lb-img-wrap {
            overflow: hidden;
            width: 100vw;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: grab;
        }
        #lb-img-wrap.lb-grabbing { cursor: grabbing; }

        /* The image itself */
        #lb-image {
            max-width: 88vw;
            max-height: 82vh;
            border-radius: 10px;
            box-shadow: 0 15px 60px rgba(0,0,0,0.6);
            animation: lbZoomIn 0.35s ease;
            transform-origin: center center;
            pointer-events: none;
            user-select: none;
            -webkit-user-drag: none;
        }

        /* Hint text */
        #lb-hint {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            color: rgba(255,255,255,0.45);
            font-size: 0.78rem;
            font-family: 'Inter', sans-serif;
            letter-spacing: 0.3px;
            pointer-events: none;
            white-space: nowrap;
        }

        /* Visual cue on hoverable images */
        .zoomable-img {
            cursor: zoom-in !important;
        }
        .zoomable-img:hover {
            outline: 2px solid rgba(0,188,212,0.55);
            outline-offset: 3px;
        }
    `;
    document.head.appendChild(style);

    // Mark all zoomable images
    images.forEach(img => {
        img.classList.add('zoomable-img');
    });

    // ---- Lightbox helpers ----
    let currentScale  = 1;
    const MIN_SCALE   = 0.4;
    const MAX_SCALE   = 6;
    const STEP        = 0.3;
    let translateX    = 0;
    let translateY    = 0;
    let isDragging    = false;
    let dragStartX, dragStartY;

    function openLightbox(src) {
        // Reset state
        currentScale = 1;
        translateX   = 0;
        translateY   = 0;

        // Build overlay
        const overlay = document.createElement('div');
        overlay.id = 'img-lightbox';

        // Image wrapper (enables panning)
        const wrap = document.createElement('div');
        wrap.id = 'lb-img-wrap';

        const modalImg = document.createElement('img');
        modalImg.id  = 'lb-image';
        modalImg.src = src;
        modalImg.alt = 'Preview Gambar';
        wrap.appendChild(modalImg);
        overlay.appendChild(wrap);

        // Toolbar
        const toolbar = document.createElement('div');
        toolbar.id = 'lb-toolbar';
        toolbar.innerHTML = `
            <button class="lb-btn" id="lb-zoom-out"   title="Zoom Out (-)">
                <i class="fa-solid fa-magnifying-glass-minus"></i>
            </button>
            <button class="lb-btn" id="lb-zoom-in"    title="Zoom In (+)">
                <i class="fa-solid fa-magnifying-glass-plus"></i>
            </button>
            <button class="lb-btn" id="lb-zoom-reset" title="Reset (0)">
                <i class="fa-solid fa-arrows-rotate"></i>
            </button>
            <span id="lb-zoom-label">100%</span>
        `;
        overlay.appendChild(toolbar);

        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.id = 'lb-close-btn';
        closeBtn.title = 'Tutup (Esc)';
        closeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        overlay.appendChild(closeBtn);

        // Hint
        const hint = document.createElement('div');
        hint.id = 'lb-hint';
        hint.textContent = 'Scroll / pinch untuk zoom  ·  Klik & geser untuk pan  ·  Esc untuk menutup';
        overlay.appendChild(hint);

        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';

        const label = document.getElementById('lb-zoom-label');

        // Apply CSS transform
        function applyTransform(smooth) {
            modalImg.style.transition = smooth
                ? 'transform 0.18s cubic-bezier(0.4,0,0.2,1)'
                : 'none';
            modalImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentScale})`;
            label.textContent = Math.round(currentScale * 100) + '%';
        }

        // ---- Controls ----
        document.getElementById('lb-zoom-in').addEventListener('click', e => {
            e.stopPropagation();
            currentScale = Math.min(MAX_SCALE, currentScale + STEP);
            applyTransform(true);
        });
        document.getElementById('lb-zoom-out').addEventListener('click', e => {
            e.stopPropagation();
            currentScale = Math.max(MIN_SCALE, currentScale - STEP);
            applyTransform(true);
        });
        document.getElementById('lb-zoom-reset').addEventListener('click', e => {
            e.stopPropagation();
            currentScale = 1; translateX = 0; translateY = 0;
            applyTransform(true);
        });

        // ---- Mouse wheel zoom ----
        overlay.addEventListener('wheel', e => {
            e.preventDefault();
            const delta = e.deltaY < 0 ? STEP : -STEP;
            currentScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, currentScale + delta));
            applyTransform(true);
        }, { passive: false });

        // ---- Mouse drag / pan ----
        wrap.addEventListener('mousedown', e => {
            if (e.button !== 0) return;
            isDragging  = true;
            dragStartX  = e.clientX - translateX;
            dragStartY  = e.clientY - translateY;
            wrap.classList.add('lb-grabbing');
            e.preventDefault();
        });
        const onMouseMove = e => {
            if (!isDragging) return;
            translateX = e.clientX - dragStartX;
            translateY = e.clientY - dragStartY;
            applyTransform(false);
        };
        const onMouseUp = () => {
            if (isDragging) {
                isDragging = false;
                wrap.classList.remove('lb-grabbing');
            }
        };
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup',   onMouseUp);

        // ---- Touch pinch-to-zoom ----
        let touchStartDist  = null;
        let touchStartScale = 1;
        overlay.addEventListener('touchstart', e => {
            if (e.touches.length === 2) {
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                touchStartDist  = Math.hypot(dx, dy);
                touchStartScale = currentScale;
            }
        }, { passive: true });
        overlay.addEventListener('touchmove', e => {
            if (e.touches.length === 2 && touchStartDist) {
                e.preventDefault();
                const dx   = e.touches[0].clientX - e.touches[1].clientX;
                const dy   = e.touches[0].clientY - e.touches[1].clientY;
                const dist = Math.hypot(dx, dy);
                currentScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, touchStartScale * (dist / touchStartDist)));
                applyTransform(false);
            }
        }, { passive: false });
        overlay.addEventListener('touchend', () => { touchStartDist = null; });

        // ---- Keyboard shortcuts ----
        function handleKey(e) {
            if (e.key === 'Escape') { closeLightbox(); }
            if (e.key === '+' || e.key === '=') { currentScale = Math.min(MAX_SCALE, currentScale + STEP); applyTransform(true); }
            if (e.key === '-')                  { currentScale = Math.max(MIN_SCALE, currentScale - STEP); applyTransform(true); }
            if (e.key === '0')                  { currentScale = 1; translateX = 0; translateY = 0; applyTransform(true); }
        }
        document.addEventListener('keydown', handleKey);

        // ---- Close ----
        function closeLightbox() {
            overlay.classList.add('lb-closing');
            document.body.style.overflow = '';
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup',   onMouseUp);
            document.removeEventListener('keydown',   handleKey);
            setTimeout(() => { if (overlay.parentNode) overlay.remove(); }, 280);
        }

        closeBtn.addEventListener('click', e => { e.stopPropagation(); closeLightbox(); });

        // Close when clicking outside the image
        overlay.addEventListener('click', e => {
            if (e.target === overlay || e.target === wrap) closeLightbox();
        });
    }

    // Attach click handler to all zoomable images
    images.forEach(img => {
        img.addEventListener('click', function(e) {
            e.stopPropagation();
            openLightbox(this.src);
        });
    });

    // ===== DATA PENDUKUNG SEKUNDER REFERENCE TOGGLE =====
    const refBtn       = document.getElementById('ds-ref-btn');
    const refContainer = document.getElementById('ds-ref-container');
    
    if (refBtn && refContainer) {
        refBtn.addEventListener('click', function() {
            refBtn.classList.toggle('active');
            if (refBtn.classList.contains('active')) {
                refContainer.style.maxHeight = (refContainer.scrollHeight + 30) + 'px';
            } else {
                refContainer.style.maxHeight = '0';
            }
        });
    }
    
    console.log('Material page interactive features loaded successfully!');
});
