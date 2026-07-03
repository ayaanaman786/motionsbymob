const canvas = document.getElementById("hero-lightpass");
const context = canvas.getContext("2d");

const frameCount = 40;
const currentFrame = index => (
  `./ezgif-327593e3321d0015-jpg/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.webp`
);

// --- ASYNC PRELOADING ARCHITECTURE ---
const globalLoader = document.getElementById('global-loader');
const loaderProgress = document.getElementById('loader-progress');

const CRITICAL_FRAMES = 15; // Only wait for the first 15 frames to unlock site
let loadedCriticalFrames = 0;

const preloadImagesAsync = () => {
    return new Promise((resolve) => {
        // Load critical frames
        for (let i = 0; i < CRITICAL_FRAMES; i++) {
            const img = new Image();
            img.src = currentFrame(i);
            
            img.onload = () => {
                loadedCriticalFrames++;
                
                // Update progress bar width
                const pct = (loadedCriticalFrames / CRITICAL_FRAMES) * 100;
                if (loaderProgress) loaderProgress.style.width = `${pct}%`;
                
                // Draw frame 0 immediately so it's ready when the curtain drops
                if (i === 0) {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    context.drawImage(img, 0, 0);
                }
                
                // If all critical frames are loaded, resolve the promise
                if (loadedCriticalFrames === CRITICAL_FRAMES) {
                    resolve();
                }
            };
            
            img.onerror = () => {
                // Failsafe in case of broken image links
                loadedCriticalFrames++;
                if (loadedCriticalFrames === CRITICAL_FRAMES) resolve();
            };
        }
    });
};

const img = new Image(); // Global image object required for drawing frames

const updateImage = index => {
  img.src = currentFrame(index);
  context.drawImage(img, 0, 0);
}

// UI Elements
const scrollIndicator = document.querySelector('.scroll-indicator');
const progressBar = document.querySelector('.scroll-progress-bar');
const cursor = document.querySelector('.custom-cursor');
const cursorRing = document.querySelector('.custom-cursor-ring');

const logoContainer = document.querySelector('.logo-replica-container');
const logoMainText = document.querySelector('.logo-main-text');

const sideText1 = document.getElementById('side-text-1');
const sideText2 = document.getElementById('side-text-2');
const sideText3 = document.getElementById('side-text-3');

const introSection = document.getElementById('intro-section');
const gallerySection = document.getElementById('gallery-section');
const galleryTrack = document.querySelector('.gallery-track');
const lightboxModal = document.getElementById('lightbox-modal');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.querySelector('.lightbox-close');

const toggleViewBtn = document.getElementById('toggle-view-menu');
const viewMenu = document.querySelector('.view-menu');
const btnGridView = document.getElementById('btn-grid-view');
const btnCarouselView = document.getElementById('btn-carousel-view');

let isGridView = false;

// --- LENIS SMOOTH SCROLLING SETUP ---
// Initialize Lenis for that premium, heavy momentum scroll
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // standard ease-out-expo
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

// LOCK SCROLLING UNTIL LOADED
lenis.stop();

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// --- CHROMATIC ABERRATION ON SCROLL ---
lenis.on('scroll', (e) => {
    let vel = Math.abs(e.velocity || 0);
    let split = Math.min(15, vel * 0.3); // Cap RGB split at 15px
    
    // Apply RGB ghosting to main logo text and heavy headings
    if (split > 0.5) {
        logoMainText.style.textShadow = `${split}px 0 rgba(255,0,0,0.8), -${split}px 0 rgba(0,0,255,0.8)`;
    } else {
        logoMainText.style.textShadow = 'none';
    }
});
// ------------------------------------

// Custom Cursor Logic with requestAnimationFrame debounce for max performance
let cursorX = window.innerWidth / 2;
let cursorY = window.innerHeight / 2;
let isCursorUpdating = false;

document.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
    
    if (!isCursorUpdating) {
        isCursorUpdating = true;
        requestAnimationFrame(() => {
            cursor.style.left = `${cursorX}px`;
            cursor.style.top = `${cursorY}px`;
            
            // Smooth trailing effect for the ring
            cursorRing.animate({
                left: `${cursorX}px`,
                top: `${cursorY}px`
            }, { duration: 150, fill: "forwards" });
            
            isCursorUpdating = false;
        });
    }
});

// Hover effect for interactive/text elements
document.querySelectorAll('h2, p, .logo-main-text, .logo-sub-text').forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
});

window.addEventListener('scroll', () => {  
  const scrollTop = document.documentElement.scrollTop;
  const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight;
  const scrollFraction = scrollTop / maxScrollTop;
  // The page is now 1000vh total.
  // 0 - 50% scroll is the Intro Animation (0-500vh)
  // 50% - 100% scroll is the Gallery (500vh-1000vh)
  
  let introFraction = Math.min(1, scrollFraction / 0.5); // 0 to 1 during the first half
  let galleryFraction = Math.max(0, (scrollFraction - 0.5) / 0.5); // 0 to 1 during the second half
  
  // Calculate which frame to show (1-40) based ONLY on the intro fraction
  const frameIndex = Math.min(
    frameCount - 1,
    Math.floor(introFraction * frameCount)
  );
  
  requestAnimationFrame(() => updateImage(frameIndex));

  // Top Progress Bar (scales across entire 1000vh page)
  progressBar.style.width = `${scrollFraction * 100}%`;

  // Logo Scroll Animations (Depth of Field Blur) - Only happens during intro
  let blurAmount = Math.min(25, (introFraction / 0.8) * 25);
  let opacityAmount = Math.max(0, 1 - (introFraction / 0.8));
  logoContainer.style.setProperty('filter', `blur(${blurAmount}px)`, 'important');
  logoContainer.style.setProperty('opacity', opacityAmount.toString(), 'important');

  // Fade out scroll indicator early in intro
  if (introFraction > 0.1) {
      scrollIndicator.style.opacity = '0';
  } else {
      scrollIndicator.style.opacity = '0.8';
  }

  // Animation for Side Text 1 (Appears 20% - 70% of Intro)
  if (introFraction > 0.2 && introFraction < 0.7) {
      let localProg = (introFraction - 0.2) / 0.5;
      sideText1.style.opacity = localProg < 0.5 ? localProg * 2 : (1 - localProg) * 2;
      sideText1.style.transform = `translateX(${(1 - localProg) * -30}px)`;
  } else {
      sideText1.style.opacity = '0';
      sideText1.style.transform = `translateX(-30px)`;
  }

  // Animation for Side Text 2 (Appears 40% - 90% of Intro)
  if (introFraction > 0.4 && introFraction < 0.9) {
      let localProg = (introFraction - 0.4) / 0.5;
      sideText2.style.opacity = localProg < 0.5 ? localProg * 2 : (1 - localProg) * 2;
      sideText2.style.transform = `translateX(${(1 - localProg) * 30}px)`;
  } else {
      sideText2.style.opacity = '0';
      sideText2.style.transform = `translateX(30px)`;
  }

  // Animation for Side Text 3 (Appears 60% - 100% of Intro)
  if (introFraction > 0.6 && introFraction <= 1) {
      let localProg = (introFraction - 0.6) / 0.4;
      sideText3.style.opacity = localProg < 0.5 ? localProg * 2 : (1 - localProg) * 2;
      sideText3.style.transform = `translateX(${(1 - localProg) * -30}px)`;
  } else {
      sideText3.style.opacity = '0';
      sideText3.style.transform = `translateX(-30px)`;
  }

  // --- Z-AXIS CAMERA FLIGHT (INTRO) ---
  if (introFraction > 0.8) {
      // Aggressively scale up to fly *through* the screen into the gallery
      let scaleAmt = 1 + ((introFraction - 0.8) / 0.2) * 4; // Scales from 1x to 5x
      introSection.style.transform = `scale(${scaleAmt})`;
      introSection.style.transformOrigin = `center center`;
  } else {
      introSection.style.transform = `scale(1)`;
  }

  // Hide intro section entirely when passed 50% to prevent overlapping with gallery
  if (scrollFraction > 0.51) {
      introSection.style.opacity = 0;
  } else {
      introSection.style.opacity = 1;
  }

  // --- GALLERY LOGIC ---
  
  if (isGridView) {
      galleryTrack.style.transform = 'none';
      return; // Skip cover-flow math in Grid Mode
  }
  
  // --- Z-AXIS CAMERA FLIGHT (GALLERY) ---
  // The gallery pushes forward from deep Z-space
  let trackScale = 0.5 + Math.min(0.5, galleryFraction * 2.5); // Scales from 0.5 to 1.0 fast
  galleryTrack.style.transform = `scale(${trackScale})`;
  galleryTrack.style.transformOrigin = `center center`;
  
  const items = document.querySelectorAll('.gallery-item');
  const numItems = items.length;
  
  // Progress goes from 0 to numItems - 1
  let progress = galleryFraction * (numItems - 1);
  let currentIndex = Math.round(progress);
  
  items.forEach((item, i) => {
      let offset = i - progress;
      let absOffset = Math.abs(offset);
      
      // Calculate transforms for the Cover Flow effect
      // Shift each item horizontally. 30vw ensures it tucks behind the 50vw center item.
      let translateX = offset * 30; // vw
      // Scale down side images
      let scale = Math.max(0.6, 1 - absOffset * 0.4);
      // Ensure center item is on top
      let zIndex = Math.round(100 - absOffset * 10);
      // Dim side images for depth (Blur removed for performance)
      let brightness = Math.max(0.3, 1 - absOffset * 0.5); 
      // Fade out images that are far away
      let opacity = Math.max(0, 1 - absOffset + 0.8);
      
      item.style.transform = `translateX(${translateX}vw) scale(${scale})`;
      item.style.zIndex = zIndex;
      item.style.filter = `brightness(${brightness})`;
      item.style.opacity = opacity;
      
      if (absOffset < 0.5) {
          item.classList.add('active');
      } else {
          item.classList.remove('active');
      }
  });
});

// --- LIGHTBOX LOGIC ---
const galleryItems = document.querySelectorAll('.gallery-item img');
let currentLightboxIndex = 0;

document.querySelectorAll('.gallery-item').forEach((item, index) => {
    item.addEventListener('click', (e) => {
        const imgEl = item.querySelector('img');
        if (imgEl) {
            currentLightboxIndex = index;
            lightboxImg.src = imgEl.src;
            lightboxModal.classList.add('active');
            cursorRing.classList.remove('hover');
        }
    });
});

const updateLightboxImage = () => {
    if (currentLightboxIndex >= 0 && currentLightboxIndex < galleryItems.length) {
        lightboxImg.src = galleryItems[currentLightboxIndex].src;
    }
};

const showNextImage = () => {
    currentLightboxIndex = (currentLightboxIndex + 1) % galleryItems.length;
    updateLightboxImage();
};

const showPrevImage = () => {
    currentLightboxIndex = (currentLightboxIndex - 1 + galleryItems.length) % galleryItems.length;
    updateLightboxImage();
};

const lightboxNextBtn = document.querySelector('.lightbox-next');
const lightboxPrevBtn = document.querySelector('.lightbox-prev');

if (lightboxNextBtn) lightboxNextBtn.addEventListener('click', showNextImage);
if (lightboxPrevBtn) lightboxPrevBtn.addEventListener('click', showPrevImage);

lightboxClose.addEventListener('click', () => {
    lightboxModal.classList.remove('active');
});

// Close modal if clicking outside the image
lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
        lightboxModal.classList.remove('active');
    }
});

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    if (lightboxModal.classList.contains('active')) {
        if (e.key === 'Escape') lightboxModal.classList.remove('active');
        if (e.key === 'ArrowRight') showNextImage();
        if (e.key === 'ArrowLeft') showPrevImage();
    }
});

// --- VIEW TOGGLE LOGIC ---
toggleViewBtn.addEventListener('click', () => {
    viewMenu.classList.toggle('active');
});

btnGridView.addEventListener('click', () => {
    isGridView = true;
    gallerySection.classList.add('grid-mode');
    viewMenu.classList.remove('active');
    
    // Strip inline styles from items to let CSS Grid take over
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.style.transform = '';
        item.style.filter = '';
        item.style.opacity = '';
        item.style.zIndex = '';
        item.classList.remove('active');
    });

    // Scroll to the top of the gallery so the user isn't stranded when heights collapse
    lenis.scrollTo(gallerySection, { immediate: true });
});

btnCarouselView.addEventListener('click', () => {
    isGridView = false;
    gallerySection.classList.remove('grid-mode');
    viewMenu.classList.remove('active');
    
    // Force a scroll event to recalculate carousel positions immediately
    window.dispatchEvent(new Event('scroll'));
});

// --- INITIALIZE PRELOADER ---
preloadImagesAsync().then(() => {
    // 1. Hide the global loading screen
    if (globalLoader) {
        globalLoader.style.opacity = '0';
        globalLoader.style.visibility = 'hidden';
    }
    
    // 2. Unlock the scroll physics
    lenis.start();
    
    // 3. Silently lazy-load the remaining frames in the background
    for (let i = CRITICAL_FRAMES; i < frameCount; i++) {
        const img = new Image();
        img.src = currentFrame(i);
    }
});

// --- CSS MASK TRACKING FOR ABOUT SECTION ---
const distortionFrame = document.getElementById('distortion-frame');

if (distortionFrame) {
    distortionFrame.addEventListener('mousemove', (e) => {
        // Get mouse coordinates relative to the frame itself
        const rect = distortionFrame.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Update CSS variables for the mask-image radial-gradient
        distortionFrame.style.setProperty('--mouse-x', `${x}px`);
        distortionFrame.style.setProperty('--mouse-y', `${y}px`);
    });

    // Optional: Hide the distortion when mouse leaves the frame
    distortionFrame.addEventListener('mouseleave', () => {
        distortionFrame.style.setProperty('--mouse-x', `-200px`);
        distortionFrame.style.setProperty('--mouse-y', `-200px`);
    });
}

// --- 3D TILT & LIGHTING LOGIC ---
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

document.querySelectorAll('.gallery-item, .about-image-frame').forEach(item => {
    item.addEventListener('mousemove', (e) => {
        if (isTouchDevice) return; // Disable heavy 3D tilt math on mobile touch screens
        
        const rect = item.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Calculate tilt percentages (-1 to 1)
        const xPct = (x / rect.width - 0.5) * 2;
        const yPct = (y / rect.height - 0.5) * 2;
        
        // Rotate max 15 degrees
        const rotateX = -yPct * 15;
        const rotateY = xPct * 15;
        
        // Target the inner wrapper if it exists (for gallery), otherwise target the item itself
        const inner = item.querySelector('.gallery-item-inner') || item;
        inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        
        // Update Specular Glare position
        inner.style.setProperty('--glare-x', `${(x / rect.width) * 100}%`);
        inner.style.setProperty('--glare-y', `${(y / rect.height) * 100}%`);
    });
    
    item.addEventListener('mouseleave', () => {
        const inner = item.querySelector('.gallery-item-inner') || item;
        inner.style.transform = `rotateX(0deg) rotateY(0deg)`;
    });
});

// --- NUMBER COUNTER ANIMATION ---
const counters = document.querySelectorAll('.counter');
let hasCounted = false;

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !hasCounted) {
            hasCounted = true;
            counters.forEach(counter => {
                const target = +counter.getAttribute('data-target');
                const suffix = counter.getAttribute('data-suffix');
                const duration = 2000; // 2 seconds fast count
                let startTimestamp = null;
                
                const step = (timestamp) => {
                    if (!startTimestamp) startTimestamp = timestamp;
                    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                    
                    // Easing formula (fast start, slow finish)
                    const easeOutProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                    const currentCount = Math.floor(easeOutProgress * target);
                    
                    counter.innerText = currentCount + suffix;
                    
                    if (progress < 1) {
                        window.requestAnimationFrame(step);
                    } else {
                        counter.innerText = target + suffix;
                    }
                };
                
                window.requestAnimationFrame(step);
            });
        }
    });
}, { threshold: 0.5 }); // Trigger when 50% of the about section is visible

const aboutSec = document.getElementById('about-section');
if (aboutSec) {
    statsObserver.observe(aboutSec);
}

// --- NAVIGATION OVERLAY LOGIC ---
const menuToggle = document.getElementById('menu-toggle');
const navOverlay = document.getElementById('nav-overlay');
const navLinks = document.querySelectorAll('.nav-link');

if (menuToggle && navOverlay) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navOverlay.classList.toggle('active');
        
        // Prevent scroll when open
        if (navOverlay.classList.contains('active')) {
            lenis.stop();
        } else {
            lenis.start();
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // 1. Hide the hamburger icon and links
                menuToggle.classList.remove('active');
                const navLinksContainer = document.querySelector('.nav-links');
                navLinksContainer.style.transition = 'opacity 0.3s ease';
                navLinksContainer.style.opacity = '0';
                
                // 2. Wait for links to fade, leaving just the black overlay
                setTimeout(() => {
                    // 3. MUST start lenis BEFORE scrolling, otherwise the scroll command is ignored!
                    lenis.start();
                    
                    if (targetId === 'intro-section') {
                        lenis.scrollTo(0, { immediate: true });
                    } else if (targetId === 'gallery-section') {
                        lenis.scrollTo(window.innerHeight * 5, { immediate: true });
                    } else {
                        lenis.scrollTo(targetSection, { immediate: true });
                    }
                    
                    // 4. Wait a tiny bit for render, then fade out the black overlay
                    setTimeout(() => {
                        navOverlay.classList.remove('active');
                        
                        // Reset link visibility for next time
                        setTimeout(() => {
                            navLinksContainer.style.opacity = '1';
                            navLinksContainer.style.transition = '';
                        }, 400); // Wait for overlay to finish fading
                    }, 50);
                }, 300);
            }
        });
    });
}
