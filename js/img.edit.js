(function($) {
	$.fn.extend({
		editImg:function(cfg) {
			var self = $(this);
			var canvas = self[0];
			var cw = self.width();
			var ch = self.height();
			canvas.width = cw;
			canvas.height = ch;
			var ctx = canvas.getContext('2d');
			self.data('width', cw);
			self.data('height', ch);
			self.data('ctx', ctx);
			self.data('scale', cfg.scale ? cfg.scale : 1);
			self.data('x', cfg.x ? cfg.x : 0);
			self.data('y', cfg.y ? cfg.y : 0);
			self.data('deg', cfg.deg ? cfg.deg : 0);
			self.data('flipX', cfg.flipX ? cfg.flipX : 0);
			ctx.clearRect(0, 0, cw, ch);
			var img = new Image();
	 		img.src = cfg.file;
	 		img.onload = function() {
	 			var ratio = img.width / img.height;
	 			var c_ratio = cw/ch;
	 			var iw = (ratio < 1 || c_ratio > 1) ? cw : img.width*(ch/img.height);
	 			var ih = (ratio < 1 || c_ratio > 1) ? img.height*(cw/img.width) : ch;
	 			self.data('iw', iw);
				self.data('ih', ih);
				self.data('file', cfg.file);
	 			//ctx.drawImage(img, 0, 0, iw, ih);
	 			self.data('img', img);
	 			self.repaint({});
	 		};
		},
		repaint: function(options) {
			var self = $(this);
			var ctx = self.data('ctx');
			var cw = self.data('width');
			var ch = self.data('height');
			var scale = self.data('scale');
			var x = self.data('x');
			var y = self.data('y');
			var deg = self.data('deg');
			var flipX = self.data('flipX');
			if (options.flipX) {
				flipX = flipX == 1 ? 0 : 1;
				self.data('flipX', flipX);
			}
			if (options.scale) {
				var scale = self.data('scale') + options.scale;
				self.data('scale', scale);
			}
			if (options.deg) {
				options.deg = flipX == 1 ? -options.deg : options.deg;
				var deg = self.data('deg') + options.deg*Math.PI/180;
				self.data('deg', deg);
			}
			if (options.x) {
				options.x = flipX == 1 ? -options.x : options.x;
				var x = self.data('x') + options.x*Math.cos(-deg);
				var y = self.data('y') + options.x*Math.sin(-deg);
				self.data('x', x);
				self.data('y', y);
			}
			if (options.y) {
				var x = self.data('x') + options.y*Math.sin(deg);
				var y = self.data('y') + options.y*Math.cos(deg);
				self.data('x', x);
				self.data('y', y);
			}
			ctx.clearRect(0, 0, cw, ch);
 			ctx.save();
 			ctx.translate(cw/2 , ch/2);
 			ctx.rotate(deg);
			var iw = self.data('iw');
			var ih = self.data('ih');
			if (flipX == 1) {
				deg = -2*deg;
				ctx.rotate(deg);
				ctx.scale(-1, 1);
			} 
			ctx.drawImage(self.data('img'), x - cw*scale/2, y - ch*scale/2, iw*scale, ih*scale);
			ctx.restore();
		},
		config: function() {
			var self = $(this);
			var cfg = {};
			cfg.scale = self.data('scale');
			cfg.x = self.data('x');
			cfg.y = self.data('y');
			cfg.deg = self.data('deg');
			cfg.flipX = self.data('flipX');
			cfg.file = self.data('file');
			return cfg;
		}
	})
})(jQuery);