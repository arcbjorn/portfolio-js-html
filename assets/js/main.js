(function($) {

	var $window = $(window),
		$body = $('body'),
		$header = $('#header'),
		$menuToggle = null,
		$nav = $('#nav'),
		$wrapper = $('#wrapper');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '1025px',  '1280px' ],
			medium:   [ '737px',   '1024px' ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ null,      '480px'  ],
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
			initTypeWriter();
		});
		
		function initTypeWriter() {
			const txtElement = document.querySelector('.typing');
			const words = JSON.parse(txtElement.getAttribute('data-words'));
			const wait = txtElement.getAttribute('data-wait');
			new TypeWriter(txtElement, words, wait);
		}

		// ES6 Class
		class TypeWriter {
			constructor(txtElement, words, wait = 1000) {
			this.txtElement = txtElement;
			this.words = words;
			this.txt = '';
			this.wordIndex = 0;
			this.wait = parseInt(wait, 10);
			this.type();
			this.isDeleting = false;
			}
		
			type() {
			// Current index of word
			const current = this.wordIndex % this.words.length;
			// Get full text of current word
			const fullTxt = this.words[current];
		
			// Check if deleting
			if(this.isDeleting) {
				// Remove char
				this.txt = fullTxt.substring(0, this.txt.length - 1);
			} else {
				// Add char
				this.txt = fullTxt.substring(0, this.txt.length + 1);
			}
		
			// Insert txt into element
			this.txtElement.innerHTML = `<span class="txt">${this.txt}</span>`;
		
			// Initial Type Speed
			let typeSpeed = 300;
		
			if(this.isDeleting) {
				typeSpeed /= 2;
			}
		
			// If word is complete
			if(!this.isDeleting && this.txt === fullTxt) {
				// Make pause at end
				typeSpeed = this.wait;
				// Set delete to true
				this.isDeleting = true;
			} else if(this.isDeleting && this.txt === '') {
				this.isDeleting = false;
				// Move to next word
				this.wordIndex++;
				// Pause before start typing
				typeSpeed = 500;
			}
		
			setTimeout(() => this.type(), typeSpeed);
			}
		}

	// Tweaks/fixes.

		// Polyfill: Object fit.
			if (!browser.canUse('object-fit')) {

				$('.image[data-position]').each(function() {

					var $this = $(this),
						$img = $this.children('img');

					// Apply img as background.
						$this
							.css('background-image', 'url("' + $img.attr('src') + '")')
							.css('background-position', $this.data('position'))
							.css('background-size', 'cover')
							.css('background-repeat', 'no-repeat');

					// Hide img.
						$img
							.css('opacity', '0');

				});

			}

	// Header Panel.

		// Nav.
			var $nav_a = $nav.find('a');

			$nav_a
				.addClass('scrolly')
				.on('click', function() {

					var $this = $(this);

					// External link? Bail.
						if ($this.attr('href').charAt(0) != '#')
							return;

					// Deactivate all links.
						$nav_a.removeClass('active');

					// Activate link *and* lock it (so Scrollex doesn't try to activate other links as we're scrolling to this one's section).
						$this
							.addClass('active')
							.addClass('active-locked');

				})
				.each(function() {

					var	$this = $(this),
						id = $this.attr('href'),
						$section = $(id);

					// No section for this link? Bail.
						if ($section.length < 1)
							return;

					// Scrollex.
						$section.scrollex({
							mode: 'middle',
							top: '5vh',
							bottom: '5vh',
							initialize: function() {

								// Deactivate section.
									$section.addClass('inactive');

							},
							enter: function() {

								// Activate section.
									$section.removeClass('inactive');

								// No locked links? Deactivate all links and activate this section's one.
									if ($nav_a.filter('.active-locked').length == 0) {

										$nav_a.removeClass('active');
										$this.addClass('active');

									}

								// Otherwise, if this section's link is the one that's locked, unlock it.
									else if ($this.hasClass('active-locked'))
										$this.removeClass('active-locked');

							}
						});

				});

		// MenuToggle.
			$menuToggle = $(
				'<div id="menuToggle">' +
					'<a href="#header" class="toggle noSelect"></a>' +
				'</div>'
			)
				.appendTo($body);

		// Panel.
			$header
				.panel({
					delay: 500,
					hideOnClick: true,
					hideOnSwipe: true,
					resetScroll: true,
					resetForms: true,
					side: 'right',
					target: $body,
					visibleClass: 'header-visible'
				});

	// Scrolly.
		$('.scrolly').scrolly({
			speed: 1000,
			offset: function() {

				if (breakpoints.active('<=medium'))
					return $titleBar.height();

				return 0;

			}
		});

})(jQuery);