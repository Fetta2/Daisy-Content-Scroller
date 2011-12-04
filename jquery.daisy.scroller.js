/*
 *  Daisy Content Scroller 1.0
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
				scrollSpeed  :  400
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
					$(this).append(
						$('<span></span>').addClass('counter').append( (index + 1) + ' of ' + totalNodes)
					);
				});

				if (totalWidth > $this.width() ) {

					// start scroll on clickable events
					data.buttonLast.hide();
					data.buttonLast.click(function() {
						var oldX = data.nodes.position().left;
						var newX = totalWidth + (oldX - $this.width() );

						data.buttonNext.fadeIn('fast');

						if (oldX + $this.width() <= 0) {
							data.nodes.stop().animate({
								left : '+=' + $this.width()
							},
							data.options.scrollSpeed, data.options.scrollEasing, function() {
								if (oldX + $this.width() == 0) {
									data.buttonLast.fadeOut('fast');
								}
							});
						}
						else {
							data.buttonLast.fadeOut('fast');

							data.nodes.stop().animate({
								left : 0
							},
							data.options.scrollSpeed, data.options.scrollEasing);
						}
					});

					data.buttonNext.fadeIn();
					data.buttonNext.click(function() {
						var oldX = data.nodes.position().left;
						var newX = totalWidth + (oldX - $this.width() );

						data.buttonLast.fadeIn('fast');

						if (newX >= $this.width() ) {
							data.nodes.stop().animate({
								left : '-=' + $this.width()
							},
							data.options.scrollSpeed, data.options.scrollEasing, function() {
								if (newX == $this.width() ) {
									data.buttonNext.fadeOut('fast');
								}
							});
						}
						else {
							data.buttonNext.fadeOut('fast');

							data.nodes.stop().animate({
								left : $this.width() - totalWidth
							},
							data.options.scrollSpeed, data.options.scrollEasing);
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
