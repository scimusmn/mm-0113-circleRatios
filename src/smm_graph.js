include(["src/pointStack.js"],function () {
	console.log("graph");
	function param(){
		this.x = {
			min:0,
			max:0,
			divs:10,
			flip:false
		}
		this.y = {
			min:0,
			max:0,
			divs:10,
			flip:false
		}
	}

	var smm_Graph = inheritFrom(HTMLCanvasElement,function() {
		var self =this;
		//var ctx = null;
		var savedData;

		this.points = null;

		this.fade = false;

		this.newPoint = {
			x:{
				val:0,
				new:false
			},
			y:{
				val:0,
				new:false
			}
		}

		this.mouse = {x:0,y:0};

		this.range = new param();

		this.resize= function (nx,ny,nw,nh) {
			this.left=nx;
			this.top=ny;
			this.width=nw;
			this.height=nh;
		}

		this.setNumDivs = function(xDivs,yDivs){
			if(xDivs) this.range.x.divs = xDivs;
			else this.range.x.divs = 0;

			if(yDivs) this.range.y.divs = yDivs;
			else this.range.y.divs = 0;
		}

		this.setRange = function (xMin,xMax,yMin,yMax) {
			if (xMin) this.range.x.min = xMin;
			else this.range.x.min = 0

			if (xMax) this.range.x.max = xMax;
			else this.range.x.max = 1;

			if (yMin) this.range.y.min = yMin;
			else this.range.y.min = 0

			if (yMax) this.range.y.max = yMax;
			else this.range.y.max = 1;
		};

		this.convert = function (val,which) {
			return map(val,0,1,this.range[which].min,this.range[which].max);
		}

		this.onNewPoint = function () {
		}

		this.addPoint = function (pnt) {
			if(this.range.x.flip) pnt.x=1-pnt.x;
			if(this.range.y.flip) pnt.y=1-pnt.y;
			this.points.addPoint(pnt);
			this.onNewPoint();
		};

		this.newValue = function (val,which) {
			//this.points.addPoint(pnt);
			this.newPoint[which].val = val;
			this.newPoint[which].new = true;
			if(this.newPoint.x.new&&this.newPoint.y.new){
				this.addPoint({x:this.newPoint.x.val,y:this.newPoint.y.val});
			}
		};

		this.lastPoint = function(){
			if(this.points.length) return {x:this.convert(this.points.last().x,"x"),y:this.convert(this.points.last().y,"y")};
		}

		this.drawTrace = function () {
			var ctx = this.getContext("2d");
			ctx.lineWidth=this.lineWidth;
			ctx.strokeStyle = this.lineColor;
			var self =this;
			if(this.points.length>2){
				var xc = this.width*(this.points[0].x + this.points[1].x) / 2;
				var yc = this.height*(this.points[0].y + this.points[1].y) / 2;

				ctx.beginPath();
				ctx.moveTo(xc, yc);
				for (var i = 0; i < self.points.length - 1; i ++){
					if(this.fade) ctx.globalAlpha = i/self.points.length;
					xc = this.width*(self.points[i].x + self.points[i + 1].x) / 2;
					yc = this.height*(self.points[i].y + self.points[i + 1].y) / 2;
					ctx.quadraticCurveTo(self.points[i].x*this.width, self.points[i].y*this.height, xc, yc);
					//ctx.stroke();
					if(this.fade){
						ctx.stroke();
						ctx.closePath();
						ctx.beginPath();
						ctx.moveTo(xc,yc);
					}
				}
				ctx.stroke();
				ctx.closePath();

			}

		};

		this.drawGrid = function(){
			var ctx = this.getContext("2d");
			ctx.lineWidth=this.gridWidth;
			ctx.strokeStyle = this.gridColor;
			for(var i=0; i<this.range.x.divs; i++){
				ctx.beginPath();
				ctx.moveTo(i*this.width/this.range.x.divs,0);
				ctx.lineTo(i*this.width/this.range.x.divs,this.height);
				ctx.closePath();
				ctx.stroke();
			}
			for(var i=0; i<this.range.y.divs; i++){
				ctx.beginPath();
				ctx.moveTo(0,i*this.height/this.range.y.divs);
				ctx.lineTo(this.width,i*this.height/this.range.y.divs);
				ctx.closePath();
				ctx.stroke();
			}

		};

		this.customBGDraw = function(){

		}

		this.customFGDraw = function(){
			/*ctx.fillStyle = "#000";
			ctx.beginPath();
			ctx.arc(this.mouse.x*this.width,this.mouse.y*this.height,10,0,2*Math.PI);
			ctx.fill();
			ctx.closePath();*/
		}

		this.draw = function () {
			//console.log(this.width);
			var ctx = this.getContext("2d");
			ctx.beginPath();
			ctx.fillStyle = this.bgColor;
			ctx.rect(0,0,this.width,this.height);
			ctx.closePath();
			ctx.fill();

			this.customBGDraw();

			this.drawTrace(ctx);

			this.drawGrid(ctx,18,10);

			this.customFGDraw();
		};

		this.save = function(){
	    // get the data
	    savedData.src = this.toDataURL("image/png");
		}

		this.restore = function(){
	    // restore the old canvas
			ctx =  this.getContext("2d");
	    ctx.drawImage(savedData,0,0)
		}

		this.clear = function(){
			this.points.length=0;
		};

		this.erase = function(){
			this.width = this.width;
		}

		this.createdCallback = function () {
			//this.shadow = this.createShadowRoot();
			//this.canvas = document.createElement('canvas');
			//this.setup(this);
			this.range = new param();

			var xR = {min:µ("|>xMin",this),max:µ("|>xMax",this)};
			var yR = {min:µ("|>yMin",this),max:µ("|>yMax",this)};
			this.setRange(xR.min,xR.max,yR.min,yR.max);
			this.setNumDivs(µ("|>xDiv",this),µ("|>yDiv",this));
			var flip = "";
			if(flip = µ("|>flip",this)){
				this.range.x.flip = ~µ("|>flip",this).indexOf("x");
				this.range.y.flip = ~µ("|>flip",this).indexOf("y");
			}

			numPoints = µ("|>numPoints",this);


			ctx = this.getContext("2d");
			this.points = new pointStack((numPoints)?parseInt(numPoints):500);

			this.labelFont = "lighter 2vh sans-serif";
			this.fontColor = "#000";
			this.lineWidth = 3;
			this.lineColor = "#000";
			this.gridWidth = 1;
			this.gridColor = "rgba(0,0,0,.1)";
			this.refreshRate = 30;
			this.bgColor = "rgba(0,0,0,0)"

			this.mouse = {x:0,y:0};
			this.width = this.clientWidth;
			this.height = this.clientHeight;

			savedData = new Image();

			/*this.addEventListener('mousemove', function(evt) {
				var rect = this.getBoundingClientRect();
				this.mouse = {
					x: (evt.clientX - rect.left)/this.width,
					y: (evt.clientY - rect.top)/this.height
				};
		  }, false);*/
		}
	});

	document.registerElement('smm-graph', {prototype: smm_Graph.prototype, extends: 'canvas'});
	window.smmGraph = smm_Graph;
});
