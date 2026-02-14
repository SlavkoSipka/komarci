/**
 * Welfare Charity Website - Main JavaScript
 * Handles all interactive features and animations
 */

// Initialize AOS (Animate On Scroll) library - optimizovano za mobilne uređaje
AOS.init({
	duration: 400,  // Brže animacije (ranije 800ms)
	easing: 'ease-out',  // Brži easing
	once: true,  // Animacije se pokreću samo jednom (bolje performanse)
	offset: 50,  // Animacija počinje ranije (manje čekanja)
	delay: 0  // Bez default delay-a
});

(function($) {
	'use strict';

	/**
	 * Initialize Stellar.js for parallax scrolling effects
	 */
	$(window).stellar({
		responsive: false,
		parallaxBackgrounds: true,
		parallaxElements: true,
		horizontalScrolling: false,
		hideDistantElements: false,
		scrollProperty: 'scroll'
	});


	/**
	 * Set full height for elements with .js-fullheight class
	 * Adjusts on window resize
	 */
	var fullHeight = function() {
		$('.js-fullheight').css('height', $(window).height());
		$(window).resize(function(){
			$('.js-fullheight').css('height', $(window).height());
		});
	};
	fullHeight();

	/**
	 * DROPDOWN NA MOBILNOM - Click event za Usluge dugme
	 */
	$(document).ready(function() {
		// Funkcija za proveru da li je mobilni
		function isMobileDevice() {
			return $(window).width() <= 768;
		}
		
		// MOBILNI - Click handler za dropdown toggle
		$('.navbar-nav .dropdown-toggle').on('click touchstart', function(e) {
			if (isMobileDevice()) {
				e.preventDefault();
				e.stopPropagation();
				e.stopImmediatePropagation(); // Sprečava Bootstrap default handler
				
				var $this = $(this);
				var $dropdown = $this.closest('.dropdown');
				var $dropdownMenu = $dropdown.find('.dropdown-menu');
				
				// Zatvori sve druge dropdowne prvo
				$('.navbar-nav .dropdown').not($dropdown).removeClass('show');
				$('.navbar-nav .dropdown-menu').not($dropdownMenu).removeClass('show');
				
				// Toggle trenutni dropdown
				$dropdown.toggleClass('show');
				$dropdownMenu.toggleClass('show');
				
				// Podesi aria atribute
				var isOpen = $dropdown.hasClass('show');
				$this.attr('aria-expanded', isOpen);
				
				console.log('Dropdown toggled:', isOpen); // Debug
				
				return false;
			}
		});
		
		// Zatvori dropdown kada se klikne van njega
		$(document).on('click touchstart', function(e) {
			if (isMobileDevice()) {
				if (!$(e.target).closest('.navbar-nav .dropdown').length) {
					$('.navbar-nav .dropdown').removeClass('show');
					$('.navbar-nav .dropdown-menu').removeClass('show');
					$('.navbar-nav .dropdown-toggle').attr('aria-expanded', false);
				}
			}
		});
	});
	
	/**
	 * UVEK kreni sa vrha stranice - pri učitavanju i refresh-u
	 */
	$(window).on('beforeunload', function(){
		$(window).scrollTop(0);
	});
	
	// Forsiraj scroll na vrh pri učitavanju
	if (history.scrollRestoration) {
		history.scrollRestoration = 'manual';
	}
	window.scrollTo(0, 0);
	
	/**
	 * Hide page loader after content is loaded
	 */
	var loader = function() {
		setTimeout(function() { 
			if($('#ftco-loader').length > 0) {
				$('#ftco-loader').removeClass('show');
			}
			// Još jednom forsiraj vrh nakon loadera
			window.scrollTo(0, 0);
		}, 300); // Brže učitavanje - 300ms umesto 1300ms
	};
	loader();

	/**
	 * Fix for back button - hide loader when page is restored from bfcache
	 * This handles the case when user clicks browser back/forward buttons
	 */
	window.addEventListener('pageshow', function(event) {
		// If page is restored from bfcache (back button), hide loader immediately
		if (event.persisted || (window.performance && window.performance.navigation.type === 2)) {
			if($('#ftco-loader').length > 0) {
				$('#ftco-loader').removeClass('show');
			}
			window.scrollTo(0, 0);
		}
	});

	/**
	 * Additional fix: hide loader on popstate (browser back/forward)
	 */
	window.addEventListener('popstate', function() {
		if($('#ftco-loader').length > 0) {
			$('#ftco-loader').removeClass('show');
		}
	});

	/**
	 * Show loader immediately on any link click
	 */
	$(document).on('click', 'a:not([target="_blank"]):not([href^="#"]):not([href^="tel:"]):not([href^="mailto:"])', function(e) {
		var href = $(this).attr('href');
		if (href && href !== '#' && href !== 'javascript:void(0)' && !href.startsWith('#')) {
			$('#ftco-loader').addClass('show');
		}
	});

	/**
	 * Initialize Scrollax for smooth scrolling effects
	 */
	$.Scrollax();

	/**
	 * Initialize Owl Carousel for causes section
	 * Displays causes in a responsive carousel with navigation
	 * NO DRAG - samo strelice za navigaciju
	 */
	var carousel = function() {
		$('.carousel-cause').owlCarousel({
			autoplay: true,
			center: true,
			loop: true,
			items:1,
			margin: 30,
			stagePadding:0,
			nav: true,
			navText: ['<span class="ion-ios-arrow-back">', '<span class="ion-ios-arrow-forward">'],
			// ISKLJUČI SVE VRSTE DRAG-a - samo strelice!
			mouseDrag: false,    // Isključi drag mišem na kompu
			touchDrag: false,    // Isključi drag prstom na mobilnom
			pullDrag: false,     // Isključi pull-to-refresh drag
			freeDrag: false,     // Isključi slobodan drag
			responsive:{
				0:{
					items: 1,
					stagePadding: 0
				},
				600:{
					items: 2,
					stagePadding: 50
				},
				1000:{
					items: 3,
					stagePadding: 100
				}
			}
		});

	};
	carousel();

	/**
	 * Dropdown menu hover functionality - SAMO ZA DESKTOP
	 * Shows/hides dropdown menus on hover (ne radi na mobilnom)
	 */
	if ($(window).width() > 768) {
		$('nav .dropdown').hover(function(){
			var $this = $(this);
			$this.addClass('show');
			$this.find('> a').attr('aria-expanded', true);
			$this.find('.dropdown-menu').addClass('show');
		}, function(){
			var $this = $(this);
			$this.removeClass('show');
			$this.find('> a').attr('aria-expanded', false);
			$this.find('.dropdown-menu').removeClass('show');
		});
	}


	$('#dropdown04').on('show.bs.dropdown', function () {
		console.log('show');
	});

	/**
	 * Handle navbar behavior on scroll
	 * Adds/removes classes for sticky navbar effect
	 */
	var scrollWindow = function() {
		$(window).scroll(function(){
			var $w = $(this),
					st = $w.scrollTop(),
					navbar = $('.ftco_navbar'),
					sd = $('.js-scroll-wrap');

			if (st > 150) {
				if ( !navbar.hasClass('scrolled') ) {
					navbar.addClass('scrolled');	
				}
			} 
			if (st < 150) {
				if ( navbar.hasClass('scrolled') ) {
					navbar.removeClass('scrolled sleep');
				}
			} 
			if ( st > 350 ) {
				if ( !navbar.hasClass('awake') ) {
					navbar.addClass('awake');	
				}
				
				if(sd.length > 0) {
					sd.addClass('sleep');
				}
			}
			if ( st < 350 ) {
				if ( navbar.hasClass('awake') ) {
					navbar.removeClass('awake');
					navbar.addClass('sleep');
				}
				if(sd.length > 0) {
					sd.removeClass('sleep');
				}
			}
		});
	};
	scrollWindow();

	/**
	 * Mobile device detection utility
	 * Checks for various mobile platforms
	 */
	var isMobile = {
		Android: function() {
			return navigator.userAgent.match(/Android/i);
		},
			BlackBerry: function() {
			return navigator.userAgent.match(/BlackBerry/i);
		},
			iOS: function() {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		},
			Opera: function() {
			return navigator.userAgent.match(/Opera Mini/i);
		},
			Windows: function() {
			return navigator.userAgent.match(/IEMobile/i);
		},
			any: function() {
			return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
		}
	};

	/**
	 * Animated counter for statistics section
	 * Triggers animation when section scrolls into view
	 */
	var counter = function() {
		
		$('#section-counter').waypoint( function( direction ) {

			if( direction === 'down' && !$(this.element).hasClass('ftco-animated') ) {

				var comma_separator_number_step = $.animateNumber.numberStepFactories.separator(',')
				$('.number').each(function(){
					var $this = $(this),
						num = $this.data('number');
						console.log(num);
					$this.animateNumber(
					  {
					    number: num,
					    numberStep: comma_separator_number_step
					  }, 7000
					);
				});
				
			}

		} , { offset: '95%' } );

	};
	counter();

	/**
	 * Content animation on scroll
	 * Adds fade-in animations to elements as they enter viewport
	 */
	var contentWayPoint = function() {
		var i = 0;
		$('.ftco-animate').waypoint( function( direction ) {

			if( direction === 'down' && !$(this.element).hasClass('ftco-animated') ) {
				
				i++;

				$(this.element).addClass('item-animate');
				setTimeout(function(){

					$('body .ftco-animate.item-animate').each(function(k){
						var el = $(this);
						setTimeout( function () {
							var effect = el.data('animate-effect');
							if ( effect === 'fadeIn') {
								el.addClass('fadeIn ftco-animated');
							} else if ( effect === 'fadeInLeft') {
								el.addClass('fadeInLeft ftco-animated');
							} else if ( effect === 'fadeInRight') {
								el.addClass('fadeInRight ftco-animated');
							} else {
								el.addClass('fadeInUp ftco-animated');
							}
							el.removeClass('item-animate');
						},  k * 50, 'easeInOutExpo' );
					});
					
				}, 100);
				
			}

		} , { offset: '95%' } );
	};
	contentWayPoint();

	/**
	 * Smooth scrolling for anchor links
	 * Handles navigation to page sections
	 */
	var OnePageNav = function() {
		$(".smoothscroll[href^='#'], #ftco-nav ul li a[href^='#']").on('click', function(e) {
		 	e.preventDefault();

		 	var hash = this.hash,
		 			navToggler = $('.navbar-toggler');
		 	$('html, body').animate({
		    scrollTop: $(hash).offset().top
		  }, 700, 'easeInOutExpo', function(){
		    window.location.hash = hash;
		  });


		  if ( navToggler.is(':visible') ) {
		  	navToggler.click();
		  }
		});
		$('body').on('activate.bs.scrollspy', function () {
		  console.log('nice');
		})
	};
	OnePageNav();

	/**
	 * Initialize Magnific Popup for image gallery
	 * Enables lightbox functionality for images - BEZ tamnog overlay-a
	 */
	$('.image-popup').magnificPopup({
    type: 'image',
    closeOnContentClick: true,
    closeBtnInside: false,
    fixedContentPos: true,
    mainClass: 'mfp-no-margins mfp-with-zoom mfp-light-bg', // Svetla pozadina umesto tamne
    showCloseBtn: true,
    enableEscapeKey: true,
    gallery: {
      enabled: true,
      navigateByImgClick: true,
      preload: [0,1] // Will preload 0 - before current, and 1 after the current image
    },
    image: {
      verticalFit: true,
      titleSrc: 'title'
    },
    zoom: {
      enabled: true,
      duration: 300 // don't foget to change the duration also in CSS
    },
    callbacks: {
      open: function() {
        // Brzo prikaži sliku, bez fade animacije
        this.st.removalDelay = 0;
      }
    }
	});

	/**
	 * Initialize Magnific Popup for video embeds
	 * Handles YouTube, Vimeo, and Google Maps popups
	 */
	$('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
    disableOn: 700,
    type: 'iframe',
    mainClass: 'mfp-fade',
    removalDelay: 160,
    preloader: false,

		fixedContentPos: false
	});

	/**
	 * Initialize datepicker for appointment date field
	 */
	$('#appointment_date').datepicker({
		'format': 'm/d/yyyy',
		'autoclose': true
	});

	/**
	 * Initialize timepicker for appointment time field
	 */
	$('#appointment_time').timepicker();




})(jQuery);

