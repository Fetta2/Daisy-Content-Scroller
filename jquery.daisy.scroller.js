/*
 *  Daisy Content Scroller
 *  A lightweight horizontal content scroller
 *
 *  Copyright 2011-2012, Marc S. Brooks (http://mbrooks.info)
 *  Licensed under the MIT license:
 *  http://www.opensource.org/licenses/mit-license.php
 *
 *  Dependencies:
 *    jquery.js
 *    jquery-ui.js
 */

(function($) {
	var element;
	var methods = {
		init : function(options) {

			// default options
			var settings = $.extend({
				scrollEasing : 'easeOutCirc',
				scrollSpeed  :  400,
				showCounter  : false
			}, options);

			element = '#' + $(this).attr('id');

			return this.each(function() {
				var $this = $(this),
					data  = $this.data(element);

				if (!data) {
					$(this).data(element, {
						scroller   : $(element + ' div.daisy'),
						nodes      : $(element + ' div.daisy > div'),
						buttonLast : $(element + ' button.daisy_button_last'),
						buttonNext : $(element + ' button.daisy_button_next'),
						options    : settings
					});

					$(this).DaisyScroller('cleanup');
				}
			});
		},

		destroy : function() {
			return this.each(function() {
				$(this).removeData(element);
			});
		},

		cleanup : function() {
			return this.each(function() {
				var $this = $(this),
					data  = $this.data(element);

				var sizes = [];

				// save elements current width
				data.nodes.each(function() {
					sizes.push( $(this).width() );
				});

				// remove elements white-space
				var str = data.scroller.html();
				str = str.replace(/>\s+</g, '><');
				data.scroller.html(str);

				// re-set element properties
				data.nodes.each(function(num) {
					$(this).width(sizes[num]);
				});

				data.nodes = $(element + ' div.daisy > div');
			});
		},

		start : function() {
			return this.each(function() {
				var $this = $(this),
					data  = $this.data(element);

				var totalNodes = data.nodes.length;
				var totalWidth = 0;

				data.nodes.each(function(index) {
					totalWidth += $(this).width();

					// add counter to element
					if (data.options.showCounter) {
						$(this).append(
							$('<span></span>').addClass('counter').append( (index + 1) + ' of ' + totalNodes)
						);
					}
				});

				if (totalWidth > $this.width() ) {

					// set visibility on load
					data.buttonLast.hide();
					data.buttonNext.show(0);

					var viewButtonLast = false;
					var viewButtonNext = true;

					// show buttons on mouseover events
					$this.hover(
						function() {
							if (viewButtonLast) {
								data.buttonLast.show();
							}

							if (viewButtonNext) {
								data.buttonNext.show();
							}
						},
						function() {
							if (viewButtonLast) {
								data.buttonLast.fadeOut('fast');
							}

							if (viewButtonNext) {
								data.buttonNext.fadeOut('fast');
							}
						}
					);

					// start scroll on clickable events
					data.buttonLast.click(function() {
						data.buttonNext.fadeIn('fast');

						var posX = data.nodes.position().left;

						if (posX + $this.width() <= 0) {
							data.nodes.stop().animate({
								left : '+=' + $this.width()
							},
							data.options.scrollSpeed, data.options.scrollEasing,
								function() {
									if (posX + $this.width() == 0) {
										data.buttonLast.fadeOut('fast');
									}
								}
							);

							viewButtonNext = true;
						}
						else {
							data.buttonLast.fadeOut('fast');

							data.nodes.stop().animate({
								left : 0
							},
							data.options.scrollSpeed, data.options.scrollEasing);

							viewButtonLast = false;
						}
					});

					data.buttonNext.click(function() {
						data.buttonLast.fadeIn('fast');

						var posX = totalWidth + (data.nodes.position().left - $this.width() );

						if (posX >= $this.width() ) {
							data.nodes.stop().animate({
								left : '-=' + $this.width()
							},
							data.options.scrollSpeed, data.options.scrollEasing,
								function() {
									if (posX == $this.width() ) {
										data.buttonNext.fadeOut('fast');
									}
								}
							);

							viewButtonLast = true;
						}
						else {
							data.buttonNext.fadeOut('fast');

							data.nodes.stop().animate({
								left : $this.width() - totalWidth
							},
							data.options.scrollSpeed, data.options.scrollEasing);

							viewButtonNext = false;
						}
					});
				}
			});
		},

		reset : function() {
			return this.each(function() {
				var $this = $(this),
					data = $(this).data(element);

				data.buttonLast.hide();
				data.buttonNext.hide();

				// return the scroller to the start position
				data.nodes.stop().animate({
					left : 0
				},
				data.options.scrollSpeed, data.options.scrollEasing);
			});
		}
	};

	$.fn.DaisyScroller = function(method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1) );
		}
		else
		if (typeof method === 'object' || ! method) {
			return methods.init.apply(this, arguments);
		}
		else {
			$.error('Method ' +  method + ' does not exist on jQuery.DaisyScroller');
		}
	};
})(jQuery);
