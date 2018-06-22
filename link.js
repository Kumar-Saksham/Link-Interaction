var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

function getRandomInt(min, max){
	return Math.floor(Math.random()*(max - min + 1) + min);
}

function getDistance(x1, y1, x2, y2){
	return Math.sqrt(Math.pow((x2 - x1),2) + Math.pow((y2 - y1), 2));
}


//Mouse 
function distanceFromMouse(item){
	return Math.sqrt(Math.pow((item.x - mouse.x), 2) + Math.pow((item.y - mouse.y), 2));
}

function angleFromMouse(item){
	return Math.atan2((item.y - mouse.y),(item.x - mouse.x));
}

var mouse = {
	x: undefined,
	y: undefined
};

addEventListener('mousemove', 
	function(event){
		mouse.x = event.x;
		mouse.y = event.y;
	});


//BALL DEFINITION
function Ball(x,y,r){
	this.x = x;
	this.y = y;
	this.r = r;
	this.speed = {
		x: (Math.random()*5 -2.5)*0.5,
		y: (Math.random()*5 -2.5)*0.5
	};
	this.color = 'rgba(255,255,255,0.5)';

	this.update = function(){

		if(this.x > canvas.width + minDistance || this.x < -minDistance/2){
			this.speed.x *= -1;
		}
		if(this.y > canvas.height + minDistance/2 || this.y < -minDistance/2){
			this.speed.y *= -1
		}
		if(distanceFromMouse(this) < minDistanceFromMouse + this.r){
			repelx = 2000000*(Math.cos(angleFromMouse(this))/Math.pow(distanceFromMouse(this), 3));
			repely = 2000000*(Math.sin(angleFromMouse(this))/Math.pow(distanceFromMouse(this), 3));
			this.x += repelx;
			this.y += repely;
			
		}

		else{
			this.x += this.speed.x;
			this.y += this.speed.y;
		}


		this.draw();

		this.draw();
	}

	this.draw = function(){
		c.beginPath();
		c.arc(this.x, this.y, this.r, 0, Math.PI * 2);
		c.fillStyle = this.color;
		c.fill();
		c.closePath();
	}
}

//LINK DEFINITION
function Link(i1, i2){
	this.id = i1.toString() + i2.toString();
	this.x1 = balls[i1].x;
	this.x2 = balls[i2].x;
	this.y1 = balls[i1].y;
	this.y2 = balls[i2].y;
	this.thickness = 0.0;
	this.length = 0;
	this.color = 'rgba(255,255,255,0.7)';

	this.update = function(){
		this.x1 = balls[i1].x;
		this.x2 = balls[i2].x;
		this.y1 = balls[i1].y;
		this.y2 = balls[i2].y;
		
		this.length = getDistance(this.x1, this.y1, this.x2, this. y2);

		this.thickness = 110000/(Math.pow(this.length, 3));
		if(this.thickness > 0.9){
			this.thickness = 0.9;
		}

		this.draw();
	}

	this.draw = function(){
		c.beginPath();
		c.lineWidth = this.thickness;
		c.moveTo(this.x1,this.y1);
		c.lineTo(this.x2,this.y2);
		c.strokeStyle = this.color;
		c.stroke();	
	}
}

//Initialisation 
function init() {
	balls = [];
	links = [];
	
	for(var i = 0; i < particleCount; ){
		var flag = 0;
		var r = (Math.random()*2 + 0.6)*1.2;
		var x = getRandomInt(r, canvas.width-r);
		var y = getRandomInt(r, canvas.height-r);
		for(var j = 0; j < balls.length; j++){
			if(getDistance(balls[j].x, balls[j].y, x, y) < 2*r){
				flag = 1;
				break;
			}
		}
		 if(flag == 1){
			continue;
		}
		balls.push(new Ball(x, y, r));
		i++;
	}
};


function animate(){
	requestAnimationFrame(animate);
	c.clearRect(0, 0, canvas.width, canvas.height);
	for(var i = 0; i < balls.length; i++){
		balls[i].update();		
	}
	for(var i = 0; i < links.length; i++){
		links[i].update();
	}
	for(var i = 0; i < balls.length; i++){
		for(var j = i+1; j < balls.length; j++){
			var d = getDistance(balls[i].x, balls[i].y, balls[j].x, balls[j].y);
			var id = i.toString() + j.toString();
			var thisLink = links.filter(function(item){ return  item.id === id});
			if (thisLink.length == 0){
				if(d < minDistance){
					links.push(new Link(i, j));
				}
			}
			else{
				if(thisLink[0].length > minDistance){
			 		links.splice(links.indexOf(thisLink[0]),1);
			 	}
			}			
		}
	}
};

var balls = [];
var links = [];
var particleCount = 70;
var minDistance = 110;
var minDistanceFromMouse = 200;

init();
animate();