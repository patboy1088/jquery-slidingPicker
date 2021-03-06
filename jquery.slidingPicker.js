/*!
 * jQuery Sliding Picker
 * Furkan Tunalı
 *
 * http://www.furkantunali.com/common/created-a-jquery-slidingpicker-plugin/#POST
 *
 */
 

var _slidingPickerDefaults = {
	isset		: false,
	elements	: {
		back		: null,
		front		: null,
		front_mask	: null
	},
	positions	: { left : 0, top : 0 },
	itemCount	: 0,
	currentItem	: 0,
	totalWidth	: 0,
	itemWidth	: 0,
	widthDiffer	: 0,
	animation	: {
		easing		: 'swing',
		duration	: jQuery.browser.msie ? 900 : 'medium',
		queue		: true,
		step		: function(now, fx) {},
		complete	: function() {}
	},
	beforeSlide	: function() {},
	afterSlide	: function() {}
};

(function(jQuery) {
	jQuery.fn.slidingPicker = function(settings) {
		var currentSettings = _slidingPickerDefaults;
		jQuery.extend(true, currentSettings, settings);
		settings = currentSettings;

		if(!jQuery(settings.elements.front_mask).length) { return false; }

		settings.elements.back = this;
		jQuery(settings.elements.back).slidingPickerSetDimensions(settings);
		settings = jQuery(settings.elements.back).data('dsVars');

		var itemCount = 0;
		jQuery(settings.elements.back).children('a').each(function(i) {
			itemCount = i;
			if(!jQuery(this).hasClass('disabled')) {
				jQuery(this).click(function() {
					jQuery(settings.elements.back).slidingPickerAnimate(i);
				});
			}
		});

		settings.itemCount = itemCount;
		settings.isset = true;
		jQuery(this).data('dsVars', settings);

		jQuery(window).resize(function() {
			jQuery(settings.elements.back).slidingPickerSetDimensions(settings);
		});

		jQuery(settings.elements.back).slidingPickerAnimate(settings.currentItem);
	};

	jQuery.fn.slidingPickerSetDimensions = function(settings) {
		settings.offset		 = jQuery(settings.elements.back).offset();
		settings.totalWidth	 = jQuery(settings.elements.back).width();
		settings.widthDiffer = jQuery(settings.elements.front).children('div.calendar_front').outerWidth() - jQuery(settings.elements.back).outerWidth();
		settings.widthDiffer = settings.widthDiffer / 2;
		settings.itemWidth	 = jQuery(settings.elements.back).children('a').width();

		jQuery(settings.elements.front)
			.css('left', settings.offset.left + 'px')
			.css('margin-left', '0');
		jQuery(settings.elements.front_mask)
			.css('left', settings.offset.left + 'px')
			.css('margin-left', '0');

		jQuery(settings.elements.back).data('dsVars', settings);
		if(settings.isset) {
			jQuery(settings.elements.back).slidingPickerAnimate(settings.currentItem);
		}
	};

	jQuery.fn.slidingPickerAnimate = function(position, noDuration) {
		var settings = jQuery(this).data('dsVars');

		if(position > settings.itemCount) {
			return false;
		}

		userStep = settings.animation.step;

		var newLeft = settings.offset.left + (settings.itemWidth * position);
		settings.beforeSlide(position);

		settings.animation.step = function(now, fx) {
			jQuery(settings.elements.front)
				.css('left', now + 'px')
				.children('div').css('margin-left', (0 - (now - settings.offset.left + settings.widthDiffer)) + 'px');
		};

		settings.animation.complete = function() {
			settings.currentItem = position;
			jQuery(this).data('dsVars', settings);
			settings.afterSlide(position);
		};

		jQuery(settings.elements.front_mask).animate({
			left: (newLeft + 'px')
		}, settings.animation);
	};
})(jQuery);