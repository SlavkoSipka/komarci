/**
 * Lazy Loading za Background Slike
 * Učitava background-image samo kada element postane vidljiv
 */

document.addEventListener('DOMContentLoaded', function() {
  // Pronađi sve elemente sa inline background-image stilom
  const lazyBackgrounds = document.querySelectorAll('[style*="background-image"]');
  
  if ('IntersectionObserver' in window) {
    // Moderni browseri - koristi Intersection Observer
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const bgImage = element.style.backgroundImage;
          
          // Ako slika nije već učitana
          if (bgImage && bgImage !== 'none') {
            // Dodaj klasu da označiš da je učitano
            element.classList.add('bg-loaded');
          }
          
          // Prestani da osmatraš ovaj element
          observer.unobserve(element);
        }
      });
    }, {
      // Učitaj sliku 200px pre nego što postane vidljiva
      rootMargin: '200px 0px',
      threshold: 0.01
    });
    
    // Osmatraj sve elemente sa background slikama
    lazyBackgrounds.forEach(bg => {
      // Preskoči hero sekciju i logo (već učitani kroz preload)
      if (!bg.classList.contains('hero-wrap') && 
          !bg.closest('.navbar-brand')) {
        imageObserver.observe(bg);
      }
    });
    
  } else {
    // Fallback za stare browsere - učitaj sve odmah
    lazyBackgrounds.forEach(bg => {
      bg.classList.add('bg-loaded');
    });
  }
});
