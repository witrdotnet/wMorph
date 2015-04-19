var wmorph = {
	collie : null,
	timeline : null,
	timecursor : 0,
	pathFirst : [],
	pathFirstOpts: null,
	oToLast : [],
	repeat: false,
	numParticles : 100,
	particles : [],
	oLayer : null,
	htSize : {
		width : 800, 
		height : 500
	},
	init : function(collie, opts) {
		opts = opts || {};
		this.collie = collie;
		this.timeline = collie.Timer.timeline();
		this.repeat = opts.repeat || false;
		this.collie.Renderer.DEBUG_RENDERING_MODE = "canvas";
		this.numParticles = opts.density || 100,
		this.htSize.width = opts.width || 800;
		this.htSize.height = opts.height || 500;
		this.oLayer = new this.collie.Layer({
			width : this.htSize.width,
			height : this.htSize.height
		});
		opts.path = opts.path || [[Math.round(Math.random(1)*this.htSize.width), Math.round(this.htSize.height/2)]];
		this.pathFirstOpts = opts.pathopts || {x:0,y:0};
		var j = 0;
		for(i = 0; i<this.numParticles; i++ ) {
			if(j >= opts.path.length) j = 0;
			var x = opts.path[j][0];
			var y = opts.path[j][1];
			var oParticle = new this.collie.DisplayObject({
				x		: x - this.pathFirstOpts.x,
				y		: y - this.pathFirstOpts.y
			});
			this.pathFirst[i] = [x, y];
			this.oToLast[i] = [oParticle.get("x"), oParticle.get("y")];
		
			var r =  Math.round(Math.random()* 15) + 1;
			var oCircle = new this.collie.Circle({
				radius : opts.radius || r,
				fillColor  : opts.color || "#"+((1<<24)*Math.random()|0).toString(16),
			});
		
			oParticle.addChild(oCircle);
			this.oLayer.addChild(oParticle);
			this.particles[i] = oParticle;
			j++;
		}

		this.collie.Renderer.removeAllLayer();
		this.collie.Renderer.addLayer(this.oLayer);
		this.collie.Renderer.load(document.getElementById("container"));
	},

	start : function() {
		if(this.repeat){
			this.timeline.complete = function(){this.reset();};
			this.morph(this.pathFirst, {x:this.pathFirstOpts.x, y:this.pathFirstOpts.y, regular:true});
		}		
		this.collie.Renderer.start();
	},

	morph: function(path, opts) {
		path = path || this.path_heart;
		opts = opts || {x:200, y:200};
		for(i = 0; i<this.numParticles; i++ ) {
			var oParticle = this.particles[i];
			var oFrom = this.oToLast[i] || [oParticle.get("x"), oParticle.get("y")];
			var x = i;
			var y = i;
			if(!opts.regular){
				x = Math.floor(i*3.6) % path.length;
				y = Math.floor(i*3.6) % path.length;
			}
			var oTo = [ path[x][0]-opts.x, path[y][1]-opts.y ];
			this.oToLast[i] = oTo;
			this.timeline.add(this.timecursor, "transition", oParticle, 1000, {
				from : oFrom,
				to : oTo,
				set : ["x", "y"],
				effect : this.collie.Effect.easeInOut
			});
		}
		this.timecursor = this.timecursor + 2000;
	}
}
